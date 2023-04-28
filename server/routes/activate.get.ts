import { User } from '~~/server/lib/models/User'

export default eventHandler(async (event) => {
  const params = getQuery(event)
  const { uuid } = params
  if (!uuid)
    return { status: 'error', error: 'missing uuid' }

  const user = await User.findOne({ uuid })
  if (!user)
    return { status: 'error', error: 'user not found' }

  user.isEmailConfirmed = true
  await user.save()

  return sendRedirect(event, '/?emailConfirmed=true', 302)
})
