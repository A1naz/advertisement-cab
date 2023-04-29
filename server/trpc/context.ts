import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { getServerSession } from '#auth'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  const session = await getServerSession(event)
  return {
    session,
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
