import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import { Cabinet } from "~/server/lib/models/Cabinet";
import { Campaign } from "~/server/lib/models/Campaign";

const config = useRuntimeConfig();
export const cabinetRouter = router({
  createCabinet: publicProcedure
    .input(
      z.object({
        // xSupplierId: z.string(),
        apiKeyAdvertisement: z.string().min(10, "Некорректный ключ"),
        // apiKeyStatistic: z.string(),
        // wbToken: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const {
        // xSupplierId,
        apiKeyAdvertisement,
        // apiKeyStatistic,
        // wbToken,
      } = input;

      if (!session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "unauthorized",
        });
      }

      const user = await User.findById(session._id);

      if (!user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "unauthorized",
        });
      }

      const isApiKeyAvailable = await User.findOne({
        apiKeyAdvertisement: apiKeyAdvertisement,
      });
      

      if (isApiKeyAvailable) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Апи ключ уже занят",
        });
      }

      // if (user.apiKeyAdvertisement === apiKeyAdvertisement) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Одинаковые ключи",
      //   });
      // }

      try {
        const campaigns: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
          method: "GET",
          headers: {
            Authorization: apiKeyAdvertisement,
          },
          params: {
            type: 5, //Тип только карточки - надо потом поменять
          },
        });

        const isCabinetExist = await Campaign.find({
          user: user._id,
        });

        if (isCabinetExist) {
          await Campaign.deleteMany({ user: user._id });
        }

        user.apiKeyAdvertisement = apiKeyAdvertisement;
        await user.save();

        campaigns.forEach(async (el) => {
          const campaign: any = await $fetch(`https://advert-api.wb.ru/adv/v0/advert`, {
            method: "GET",
            headers: {
              Authorization: apiKeyAdvertisement,
            },
            params: {
              id: el.advertId,
            },
          });

          const allItems: any[] = [];
          campaign.params.forEach((item: any) => {
            const newItem = {
              category: item.setName,
              nms: item.nms,
            };
            allItems.push(newItem);
          });

          const items = allItems.map((item: any) => ({
            category: item.category,
            nms: item.nms.map((innerItem: any) => innerItem.nm),
          }));
          let showTimes = "";

          if (campaign.params[0].intervals) {
            campaign.params[0].intervals.forEach((el: any) => {
              if (showTimes.includes("|")) {
                showTimes = showTimes + `${el.begin}:00-${el.end}:00`;
              } else {
                showTimes = showTimes + `${el.begin}:00-${el.end}:00|`;
              }
            });
          }

          const newCampaign = await Campaign.create({
            uuid: uuid(),
            advertId: campaign.advertId,
            type: campaign.type,
            name: campaign.name,
            status: campaign.status,
            dailyBudget: campaign.dailyBudget,
            nms: items,
            user: user._id,
            createTime: campaign.createTime,
            params: campaign.params,
            showHours: showTimes,
          });
        });

        return { status: "ok" };
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Неверный Api-ключ Реклама",
        });
      }
    }),

  updateCabinet: publicProcedure.query(async (opts) => {
    const session = opts.ctx.session as any;

    if (!session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "unauthorized",
      });
    }

    const user = await User.findById(session._id);

    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "unauthorized",
      });
    }

    if (!user.apiKeyAdvertisement) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "unauthorized",
      });
    }

    const apiKeyAdvertisement = user.apiKeyAdvertisement;

    try {
      const campaignsFromWB: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
        method: "GET",
        headers: {
          Authorization: apiKeyAdvertisement,
        },
        params: {
          type: 5, //Тип только карточки - надо потом поменять
        },
      });

      const campaignsFromDB = await Campaign.find({
        user: user._id,
      });

      if (!campaignsFromDB) {
        return { status: "Кампаний нет" };
      }

      const finalCampaigns = campaignsFromDB.filter((campaign) => {
        return (
          campaignsFromWB.some((wbCampaign: any) => {
            if (wbCampaign.advertId === campaign.advertId) return wbCampaign;
          }) || campaign.advertId === 0
        );
      });

      campaignsFromWB.forEach((wbCampaign) => {
        if (!finalCampaigns.some((campaign) => campaign.advertId === wbCampaign.advertId)) {
          finalCampaigns.push(wbCampaign);
        }
      });

      const campaignsForDelete = <any>[];

      campaignsFromDB.forEach((wbCampaign) => {
        if (!finalCampaigns.some((campaign) => campaign.advertId === wbCampaign.advertId)) {
          campaignsForDelete.push(wbCampaign);
        }
      });
      
      campaignsForDelete.forEach(async (el: any) => {
        await Campaign.deleteOne({
          _id: el._id,
        });
      });

      finalCampaigns.forEach(async (el) => {
        if (el.advertId !== 0) {
          const campaign: any = await $fetch(`https://advert-api.wb.ru/adv/v0/advert`, {
            method: "GET",
            headers: {
              Authorization: apiKeyAdvertisement,
            },
            params: {
              id: el.advertId,
            },
          });

          const allItems: any[] = [];
          campaign.params.forEach((item: any) => {
            const newItem = {
              category: item.setName,
              nms: item.nms,
            };
            allItems.push(newItem);
          });

          const items = allItems.map((item: any) => ({
            category: item.category,
            nms: item.nms.map((innerItem: any) => innerItem.nm),
          }));
          let showTimes = "";

          if (campaign.params[0].intervals) {
            campaign.params[0].intervals.forEach((el: any) => {
              if (showTimes.includes("|")) {
                showTimes = showTimes + `${el.begin}:00-${el.end}:00`;
              } else {
                showTimes = showTimes + `${el.begin}:00-${el.end}:00|`;
              }
            });
          }

          if (el.nms) {
            if (!el.showHours) {
              el.showHours = showTimes;
            }
            el.type = campaign.type;
            el.name = campaign.name;
            el.status = campaign.status;
            el.dailyBudget = campaign.dailyBudget;
            el.nms = items;
            el.params = campaign.params;
            await el.save();
          } else {
            const newCampaign = await Campaign.create({
              uuid: uuid(),
              advertId: campaign.advertId,
              type: campaign.type,
              name: campaign.name,
              status: campaign.status,
              dailyBudget: campaign.dailyBudget,
              nms: items,
              user: user._id,
              createTime: campaign.createTime,
              params: campaign.params,
              showHours: showTimes,
            });
          }
        }
      });

      return { status: "ok" };
    } catch (error) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Неверный Api-ключ Реклама",
      });
    }
  }),
});
// export type definition of API
export type AppRouter = typeof cabinetRouter;
