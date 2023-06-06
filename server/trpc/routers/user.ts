import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import bcrypt from "bcrypt";

const config = useRuntimeConfig();
export const userRouter = router({
  editProfile: publicProcedure
    .input(
      z.object({
        email: z.string().email("Введите корректный email"),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string().min(9, "Некорректный номер"),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;
      const { input } = opts;
      const { email, firstName, lastName, phone } = input;

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

      if (email !== user.email) {
        const isUserExistByEmail = await User.findOne({ email: email });
        if (isUserExistByEmail) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email занят",
          });
        }
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone.replace("+", "");
        await user.save();
        return { status: "ok" };
      }

      user.phone = phone.replace("+", "");
      user.firstName = firstName;
      user.lastName = lastName;

      await user.save();
      return { status: "ok" };
    }),

  editPassword: publicProcedure
    .input(
      z.object({
        oldPassword: z.string().min(6, "Не менее 6 символов"),
        newPassword: z.string().min(6, "Не менее 6 символов"),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session as any;

      if (!session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "unauthorized",
        });
      }

      const { input } = opts;
      const { oldPassword, newPassword } = input;
      const user = await User.findById(session._id);

      if (!user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "unauthorized",
        });
      }

      if (!user.password) {
        user.password = await bcrypt.hashSync(newPassword, 7);
      }

      console.log(bcrypt.compareSync(oldPassword, user.password));

      if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Неверный пароль",
        });
      }

      user.password = bcrypt.hashSync(newPassword, 7);

      await user.save();
      return {
        status: "ok",
      };
    }),

  client: publicProcedure.query(async (opts) => {
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
    const format = {
      email: user.email,
      balance: user.balance,
      firstName: user.firstName,
      lastName: user.lastName,
      xSupplierId:
        user.xSupplierId == ""
          ? user.xSupplierId
          : user.xSupplierId.slice(0, 5) + "*".repeat(129) + user.xSupplierId.slice(-5),
      apiKeyStatistics:
        user.apiKeyStatistics == ""
          ? user.apiKeyStatistics
          : user.apiKeyStatistics.slice(0, 5) + "*".repeat(129) + user.apiKeyStatistics.slice(-5),

      apiKeyAdvertisement:
        user.apiKeyAdvertisement == ""
          ? user.apiKeyAdvertisement
          : user.apiKeyAdvertisement.slice(0, 5) +
            "*".repeat(129) +
            user.apiKeyAdvertisement.slice(-5),

      wbToken:
        user.wbToken == ""
          ? user.wbToken
          : user.wbToken.slice(0, 5) + "*".repeat(129) + user.wbToken.slice(-5),

      phone: user.phone,
    };

    return { user: format };
  }),
});
// export type definition of API
export type AppRouter = typeof userRouter;
