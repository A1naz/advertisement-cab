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

  deleteteCabinet: publicProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { _id } = input;

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

      await Cabinet.findByIdAndDelete(_id);

      return { status: "ok" };
    }),

  cabinets: publicProcedure.query(async (opts) => {
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

    const cabinets: any[] = await Cabinet.find({ user: session._id });

    return cabinets;
  }),
});
// export type definition of API
export type AppRouter = typeof cabinetRouter;
