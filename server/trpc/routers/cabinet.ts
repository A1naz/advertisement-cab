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
        apiKeyAdvertisement: z.string(),
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



      const campaigns: any[] = await $fetch(`https://advert-api.wb.ru/adv/v0/adverts`, {
        method: "GET",
        headers: {
          Authorization: apiKeyAdvertisement,
        },
        params: {
          type: 5, //Тип только карточки - надо потом поменять
        },
      });

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

        const newCampaign = await Campaign.create({
          uuid: uuid(),
          advertid: campaign.advertid,
          type: campaign.type,
          name: campaign.name,
          status: campaign.status,
          dailyBudget: campaign.dailyBudget,
          createTime: campaign.createTime,
          category: campaign.params[0].setName,
          params: campaign.params,
          user: session._id,
        });

        console.log(campaign.params[0]);
      });

      // console.log(cabinets);

      // const cabinet = await Cabinet.create({
      //   uuid: uuid(),
      //   title: title,
      //   connectingMethod: connectingMethod,
      //   wbToken: wbToken,
      //   phoneNumber: phoneNumber,
      //   xSupplierId: xSupplierId,
      //   apiKeyAdvertisement: apiKeyAdvertisement,
      //   apiKeyStatistic: apiKeyStatistic,
      //   user: session._id,
      // });

      return { status: "ok" };
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

    const cabinets = await Cabinet.find({ user: session._id });

    return cabinets;
  }),
});
// export type definition of API
export type AppRouter = typeof cabinetRouter;
