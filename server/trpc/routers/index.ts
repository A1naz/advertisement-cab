import { router } from '../trpc'
import { authRouter } from './auth'
import { userRouter } from './user'
import { cabinetRouter } from './cabinet'
import { campaignRouter } from './campaign' 

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  cabinet: cabinetRouter,
  campaign: campaignRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
