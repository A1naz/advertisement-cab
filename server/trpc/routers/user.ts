import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { User } from '~/server/lib/models/User'

const config = useRuntimeConfig()
export const userRouter = router({
  editProfile: publicProcedure.input(
    z.object({
      email: z.string().email(),
    }),
  ).mutation(async (opts) => {
    const session = opts.ctx.session as any
    const { input } = opts
  }),
  client: publicProcedure
    .query(async (opts) => {
      const session = opts.ctx.session as any
      if (!session) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'unauthorized',
        })
      }
      const user = await User.findById(session._id)
      if (!user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'unauthorized',
        })
      }
      const format = {
        email: user.email,
        balance: user.balance,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      return { user: format }
    }),
})
// export type definition of API
export type AppRouter = typeof userRouter
