import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import { Campaign } from "~/server/lib/models/Campaign";
import { AnyArray } from "mongoose";
import { CampaignOptions } from "~/.nuxt/components";

const config = useRuntimeConfig();
export const campaignRouter = router({
  createCampaign: publicProcedure
    .input(
      z.object({
        type: z.string(),
        title: z.string().min(3, "Название должно содержать не менее 3 символов"),
        category: z.string().min(3, "Название категории должно содержать не менее 3 символов"),
        items: z.number().array().nonempty({ message: "Минимум 1 артикул" }),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { type, title, category, items } = input;

      console.log("ok");

      let conversedType: number;

      if (type === "Карточка товара") {
        conversedType = 5;
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Некорректный тип",
        });
      }

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

      const date = new Date();
      const campaign = await Campaign.create({
        uuid: uuid(),
        advertId: 0,
        type: conversedType,
        title: title,
        user: session._id,
        nms: {
          category: category,
          nms: items,
        },
        createTime: date,
      });

      return { status: "ok" };
    }),

  adjustCampaign: publicProcedure
    .input(
      z.object({
        _id: z.string(),
        budget: z.number(),
        targetPosition: z.number(),
        dailyBudget: z.number(),
        ifMaxBetDoesntMatch: z.string().min(10),
        ifBetEqualsNear: z.string().min(10),
        showHours: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const {
        _id,
        budget,
        targetPosition,
        dailyBudget,
        ifMaxBetDoesntMatch,
        ifBetEqualsNear,
        showHours,
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

      const campaign: any = await Campaign.findById(_id);

      campaign.budget = budget;
      campaign.dailyBudget = dailyBudget;
      campaign.targetPosition = targetPosition;
      campaign.ifMaxBetDoesntMatch = ifMaxBetDoesntMatch;
      campaign.ifBetEqualsNear = ifBetEqualsNear;
      campaign.showHours = showHours;
      campaign.isAdjusted = true;
      await campaign.save();

      return { status: "ok" };
    }),

  turnOnOffCampgain: publicProcedure
    .input(
      z.object({
        _id: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { _id, status } = input;

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

      const campaign: any = await Campaign.findById(_id);

      campaign.isTurnOn = status;
      await campaign.save();

      return { status: "ok" };
    }),

  deleteteCampaign: publicProcedure
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

      await Campaign.findByIdAndDelete(_id);

      return { status: "ok" };
    }),

  campaigns: publicProcedure.query(async (opts) => {
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

    const campaigns: any[] = await Campaign.find({ user: session._id });

    const allItems: any[] = [];

    campaigns.forEach((el: any) => {
      allItems.push(...el.nms);

      let date = new Date(el.createTime);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let trueDate = `${day}.${month}.${year}`;

      if (day.toString().length < 2) {
        trueDate = `0${day}.${month}.${year}`;
      }

      if (month.toString().length < 2) {
        trueDate = `${day}.0${month}.${year}`;
      }

      if (month.toString().length < 2 && day.toString().length < 2) {
        trueDate = `0${day}.0${month}.${year}`;
      }

      el.createTime = trueDate;
    });

    const uniqueCategories = new Set();
    const trueFormItems: any[] = [];

    allItems.forEach((category) => {
      category.nms.forEach((nm: any) => {
        trueFormItems.push({ category: category.category, nms: [nm] });
      });
    });
    const items = trueFormItems.filter((item: any, index: any) => {
      return (
        index ===
        trueFormItems.findIndex((obj) => {
          return JSON.stringify(obj) === JSON.stringify(item);
        })
      );
    });

    return { campaigns, items };
  }),
});
// export type definition of API
export type AppRouter = typeof campaignRouter;
