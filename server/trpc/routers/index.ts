import { router } from '../trpc'
import { authRouter } from './auth'
import { userRouter } from './user'
import { cabinetRouter } from './cabinet'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  cabinet: cabinetRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
