import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { User } from '~/server/lib/models/User'
import { NuxtAuthHandler } from '#auth'

const runtimeConfig = useRuntimeConfig()
export default NuxtAuthHandler({
  // adapter: MongoDBAdapter(clientPromise),
  secret: runtimeConfig.SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signOut: '/',
    signIn: '/',
    error: '/',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      const isSignIn = !!user
      if (isSignIn) {
        token.email = user ? (user as any)?.email : ''
        token._id = user ? (user as any)?._id : ''
      }
      return Promise.resolve(token)
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({ session, token }) => {
      (session as any).email = token.email;
      (session as any)._id = token._id
      const found = await User.findOne({ _id: token._id })
      if (!found)
        return Promise.reject(new Error('User not found'))

      return Promise.resolve(session)
    },
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },

      async authorize(credentials: any) {
        const { email, password } = credentials

        if (!email || !password)
          return null

        const user = await User.findOne({ email })

        if (!user)
          throw new Error('User not found')

        if (!user.password)
          throw new Error('Password not set')

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid)
          throw new Error('Invalid password')

        return user
      },
    }),
  ],
})
