import { createNuxtApiHandler } from 'trpc-nuxt'
import { ZodError } from 'zod'
import { appRouter } from '~/server/trpc/routers'
import { createContext } from '~/server/trpc/context'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    if (error.cause instanceof ZodError) {
      // Returning only first zod error message to client
      error.message = JSON.parse(error.message)[0].message
    }
  },
})
