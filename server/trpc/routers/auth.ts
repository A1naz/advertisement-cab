import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { publicProcedure, router } from '../trpc'
import { User } from '~/server/lib/models/User'
import mailService from '~/server/lib/mailService'

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().email('Введите корректный email'),
        password: z.string().min(6, 'Не менее 6 символов'),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts
      const { email, password, username } = input
      const isUserExist = await User.findOne({ email })
      if (isUserExist) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пользователь уже существует',
        })
      }
      const url = useRuntimeConfig().PUBLIC_SITE_URL
      const user = await User.create({ email, password: bcrypt.hashSync(password, 7), username, uuid: uuid() })
      const link = `${url}/activate?uuid=${user.uuid}`
      const emailSend = await mailService.sendActivationMail(email, link)
      console.log(user)
      console.log(emailSend)
      return {
        status: 'ok',
        email: user.email,
        username: user.username,
      }
    }),
})
// export type definition of API
export type AppRouter = typeof authRouter
