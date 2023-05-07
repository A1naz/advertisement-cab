import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import { Campaign } from "~/server/lib/models/Campaign";

const config = useRuntimeConfig();
export const campaignRouter = router({
  createCampign: publicProcedure
    .input(
      z.object({
        type: z.string(),
        cabinetId: z.string().min(10, "Id должен быть корректным"),
        title: z.string().min(3, "Название должно содержать не менее 3 символов"),
        category: z.string().min(3, "Название категории должно содержать не менее 3 символов"),
        article: z.string().array().nonempty({ message: "Минимум 1 артикул" }),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { type, cabinetId, title, category, article } = input;

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

      const campaign = await Campaign.create({
        uuid: uuid(),
        type: type,
        title: title,
        user: session._id,
        category: category,
        article: article,
      });

      return { campaign };
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

  campaigns: publicProcedure
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

      const campaigns = await Campaign.find({ cabinet: _id });

      return campaigns;
    }),
});
// export type definition of API
export type AppRouter = typeof campaignRouter;
