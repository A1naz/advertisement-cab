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
        items: z.number().array(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { type, title, category, items } = input;

      let conversedType: number;

      if (type === "Карточка товара") {
        conversedType = 5;
      } else if (type === "Поиск") {
        conversedType = 6;
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
        name: title,
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
        maxBet: z.number(),
        targetPosition: z.string(),
        dailyBudget: z.number().optional() || z.null().optional(),
        ifMaxBetDoesntMatch: z.string().min(10),
        ifBetEqualsNear: z.string().min(10),
        showHours: z.string(),
        maxBetIncreaseTo: z.number().optional(),
        managementType: z.string().optional(),
        masterPhrase: z.string().optional(),
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
        maxBetIncreaseTo,
        maxBet,
        managementType,
        masterPhrase,
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

      if (masterPhrase && masterPhrase.length > 100) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Слишком длинная мастер-фраза",
        });
      }

      const campaign: any = await Campaign.findById(_id);

      if (maxBetIncreaseTo) {
        campaign.getBet = maxBetIncreaseTo;
      }

      if (dailyBudget || dailyBudget === 0) {
        campaign.dailyBudget = dailyBudget;
      }
      if (!dailyBudget || dailyBudget === null) {
        campaign.dailyBudget = 0;
      }

      if (campaign.type === 6) {
        campaign.managementType = managementType;
        campaign.masterPhrase = masterPhrase;
      }

      campaign.maxBet = maxBet;
      campaign.budget = budget;
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

      if (status === true) {
        return { status: "ok", message: "кампания включена" };
      }

      return { status: "ok", message: "кампания выключена" };
    }),

  deleteCampaign: publicProcedure
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

      campaign.deleteMark = status;
      await campaign.save();

      return { status: "ok" };
    }),

  campgaignStats: publicProcedure.input(z.string()).query(async (opts) => {
    const session = opts.ctx.session as any;
    const { input } = opts;
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

    const actualStats: any = await $fetch(
      `https://carousel-ads.wildberries.ru/api/v4/carousel?nm=${input}`,
      {
        method: "GET",
      }
    );

    const userWithSetId = await Campaign.findOne({ "params.nms.nm": Number(input) });

    if (userWithSetId) {
      if (userWithSetId.params[0].setId) {
        const actualWbStats: any = await $fetch(
          `https://advert-api.wb.ru/adv/v0/cpm?type=5&param=${userWithSetId.params[0].setId}`,
          {
            method: "GET",

            headers: {
              Authorization: user.apiKeyAdvertisement,
            },
          }
        );
        let wbStats: any = [];
        actualWbStats.forEach((el: any) => {
          for (let i = 0; i < el.Count; i++) {
            wbStats.push(el.Cpm);
            if (wbStats.length >= 28) {
              break;
            }
          }
        });

        actualStats.forEach((el: any, index: any) => {
          actualStats[index]["wbCpm"] = wbStats[index];
        });
      } else {
        const actualWbStats: any = await $fetch(
          `https://advert-api.wb.ru/adv/v0/cpm?type=6&param=${userWithSetId.params[0].subjectId}`,
          {
            method: "GET",
            headers: {
              Authorization: user.apiKeyAdvertisement,
            },
          }
        );
        let wbStats: any = [];
        actualWbStats.forEach((el: any) => {
          for (let i = 0; i < el.Count; i++) {
            wbStats.push(el.Cpm);
            if (wbStats.length >= 28) {
              break;
            }
          }
        });

        actualStats.forEach((el: any, index: any) => {
          actualStats[index]["wbCpm"] = wbStats[index];
        });
      }
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "артикул не найден",
      });
    }

    return actualStats;
  }),

  statsByPhrase: publicProcedure.input(z.string()).query(async (opts) => {
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

    const { input } = opts;
    const keyWord: string = input.replaceAll(" ", "%20");

    const campaigns: any = await $fetch(
      `https://catalog-ads.wildberries.ru/api/v5/search?keyword=${keyWord}`,
      {
        method: "GET",
      }
    );

    if (!campaigns.pages) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Ничего не найдено",
      });
    }

    const categories: any[] = [];
    async function fetchData(apiKey: string) {
      for (const el of campaigns.prioritySubjects) {
        const subjectInfo: any[] = await $fetch(
          `https://advert-api.wb.ru/adv/v0/params/subject?id=${el}`,
          {
            method: "GET",
            headers: {
              Authorization: apiKey,
            },
          }
        );
        categories.push({
          id: subjectInfo[0].id,
          name: subjectInfo[0].name,
        });
      }
    }

    await fetchData(user.apiKeyAdvertisement);

    const campaignsCount = campaigns.adverts.length;
    const resultCampaigns: any[] = [];
    let curPage = 0;
    let curPos = 0;

    for (let i = 0; i < campaignsCount; i++) {
      if (curPos >= 40) {
        curPage += 1;
        curPos -= 40;
      }

      if (i >= campaignsCount) {
        break;
      }

      const subjectName = categories.find((subject) => subject.id === campaigns.adverts[i].subject);
      resultCampaigns.push({
        advertPlace: i + 1,
        factPosition: campaigns.pages[curPage].positions[curPos],
        nmId: campaigns.adverts[i].id,
        subject: `${subjectName.id} - ${subjectName.name}`,
        cpm: campaigns.adverts[i].cpm,
        category: campaigns.adverts[i].subject,
      });
      curPos += 1;
    }

    return resultCampaigns;
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
