import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { publicProcedure, router } from "../trpc";
import { User } from "~/server/lib/models/User";
import mailService from "~/server/lib/mailService";

const config = useRuntimeConfig();
export const authRouter = router({
  sendResetPasswordMail: publicProcedure
    .input(
      z.object({
        email: z.string().email("Введите корректный email"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { email } = input;
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователя с таким Email не существует",
        });
      }

      const token = jwt.sign({ email: foundUser.email, uuid: foundUser.uuid }, config.SECRET, {
        expiresIn: "15m",
      });

      const url = config.public.PUBLIC_SITE_URL;
      const link = `${url}/reset-password/${token}`;

      await mailService.sendChangePasswordMail(email, link, foundUser.username);

      return {
        status: "ok",
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string().min(6, "Не менее 6 символов"),
        repeatPassword: z.string().min(6, "Не менее 6 символов"),
        token: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { password, repeatPassword, token } = input;

      if (password !== repeatPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пароли разные",
        });
      }
      let data: any;
      try {
        data = jwt.verify(token, config.SECRET);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token is invalid",
        });
      }
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token is invalid",
        });
      }

      const foundUser = await User.findOne({ uuid: data.uuid });

      if (!foundUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователя не существует",
        });
      }
      console.log(data);
      foundUser.password = bcrypt.hashSync(password, 7);
      await foundUser.save();

      return {
        status: "ok",
      };
    }),

  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        lastName: z.string().optional(),
        email: z.string().email("Введите корректный email"),
        password: z.string().min(6, "Не менее 6 символов"),
        phone: z.string().min(9, "Некорректный номер"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { email, password, username, phone, lastName } = input;

      const isUserExist = await User.findOne({ email: email.toLowerCase() });
      if (isUserExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователь уже существует",
        });
      }
      let truePhone;

      if (phone.includes("+")) {
        truePhone = phone.replace("+", "");
      }

      const url = config.public.PUBLIC_SITE_URL;
      const user = await User.create({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 7),
        username,
        lastName,
        phone: truePhone,
        uuid: uuid(),
      });
      const link = `${url}/activate?uuid=${user.uuid}`;
      const emailSend = await mailService.sendActivationMail(email, link);
      return {
        status: "ok",
        email: user.email,
        username: user.username,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof authRouter;
