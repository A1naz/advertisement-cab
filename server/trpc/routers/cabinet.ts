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
        apiKeyAdvertisement: z.string().min(10, "Некорректный апи-ключ рекламы"),
        wbToken: z.string().min(10, "Некорректный апи-ключ рекламы").optional(),
        xSupplierId: z.string().min(10, "Некорректный апи-ключ рекламы").optional(),
        apiKeyStatistic: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { apiKeyAdvertisement, apiKeyStatistic } = input;
      try {
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

        // if (
        //   (xSupplierId && !xSupplierId.includes("****************")) ||
        //   (wbToken && !wbToken.includes("****************"))
        // ) {
        //   const authorization: any = await $fetch(
        //     `https://cmp.wildberries.ru/passport/api/v2/auth/introspect`,
        //     {
        //       method: "GET",
        //       headers: {
        //         Cookie: `x-supplier-id-external=${xSupplierId}; WBToken=${wbToken}`,
        //       },
        //     }
        //   );

        //   if (!authorization.userID) {
        //     throw new TRPCError({
        //       code: "FORBIDDEN",
        //       message: "Ошибка авторизации",
        //     });
        //   }
        //   if (authorization.userID) {
        //     user.xSupplierId = xSupplierId;
        //     user.wbToken = wbToken;
        //     user.wbUserId = authorization.userID;
        //     await user.save();
        //   }
        // }

        // if (xSupplierId && !xSupplierId.includes("****************")) {
        //   user.xSupplierId = xSupplierId;
        //   await user.save();
        // }

        // if (wbToken && !wbToken.includes("****************")) {
        //   user.wbToken = wbToken;
        //   await user.save();
        // }

        if (apiKeyAdvertisement && !apiKeyAdvertisement.includes("****************")) {
          if (apiKeyAdvertisement.length < 15) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Некорректный апи ключ рекламы",
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

          const campaignsSearch: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
            method: "GET",
            headers: {
              Authorization: apiKeyAdvertisement,
            },
            params: {
              type: 6, //Тип только Поиск
            },
          });

          const campaignsCart: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
            method: "GET",
            headers: {
              Authorization: apiKeyAdvertisement,
            },
            params: {
              type: 5, //Тип карточка
            },
          });

          const campaigns: any[] = [];
          campaigns.push(...campaignsCart, ...campaignsSearch);

          const isCabinetExist = await Campaign.findOne({
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
              if (item.setName) {
                const newItem = {
                  category: item.setName,
                  nms: item.nms,
                };
                allItems.push(newItem);
              }

              if (item.subjectName) {
                const newItem = {
                  category: item.subjectName,
                  nms: item.nms,
                };
                allItems.push(newItem);
              }
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
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Неправильный апи ключ рекламы",
          });
        }

        return { status: "ok" };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Неправильный апи ключ рекламы",
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
      const campaignsFromDB = await Campaign.find({
        user: user._id,
      });

      const campaignsSearch: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
        method: "GET",
        headers: {
          Authorization: apiKeyAdvertisement,
        },
        params: {
          type: 6, //Поиск
        },
      });

      const campaignsCart: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
        method: "GET",
        headers: {
          Authorization: apiKeyAdvertisement,
        },
        params: {
          type: 5, //Карточка товара
        },
      });

      const campaignsFromWB: any[] = [];
      campaignsFromWB.push(...campaignsCart, ...campaignsSearch);

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

      if (campaignsForDelete) {
        campaignsForDelete.forEach(async (el: any) => {
          if (!el.deleteCount) {
            el.deleteCount = 0;
            await el.save();
          }

          if (el.deleteCount >= 10) {
            await Campaign.deleteOne({
              _id: el._id,
            });
          } else {
            el.deleteCount = el.deleteCount + 1;
            await el.save();
          }
        });
      }

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
            if (item.setName) {
              const newItem = {
                category: item.setName,
                nms: item.nms,
              };
              allItems.push(newItem);
            }

            if (item.subjectName) {
              const newItem = {
                category: item.subjectName,
                nms: item.nms,
              };
              allItems.push(newItem);
            }
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
            el.deleteCount = 0;
            await el.save();
          } else {
            
            const isCampaignExist = await Campaign.findOne({ advertId: el.advertId });

            if (!isCampaignExist) {
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
                deleteCount: 0,
              });
            }
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
