import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import { Cabinet } from "~/server/lib/models/Cabinet";

const config = useRuntimeConfig();
export const cabinetRouter = router({
  createCabinet: publicProcedure
    .input(
      z.object({
        title: z.string().min(3, "Название должно содержать не менее 3 символов"),
        connectingMethod: z.string(),
        phoneNumber: z.string(),
        xSupplierId: z.string(),
        apiKeyAdvertisement: z.string(),
        apiKeyStatistic: z.string(),
        wbToken: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const {
        title,
        connectingMethod,
        phoneNumber,
        xSupplierId,
        apiKeyAdvertisement,
        apiKeyStatistic,
        wbToken,
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

      const cabinet = await Cabinet.create({
        uuid: uuid(),
        title: title,
        connectingMethod: connectingMethod,
        wbToken: wbToken,
        phoneNumber: phoneNumber,
        xSupplierId: xSupplierId,
        apiKeyAdvertisement: apiKeyAdvertisement,
        apiKeyStatistic: apiKeyStatistic,
        user: session._id,
      });

      return { cabinet };
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
