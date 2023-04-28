import validator from 'validator';
import { User } from './index';
import { getServerSession } from '#auth';

export default eventHandler(async (event) => {
  const session = (await getServerSession(event)) as any;

  if (!session) return sendRedirect(event, '/auth', 302);

  const body = await readBody(event);

  const { email, userName, firstName, lastName } = body;

  if (!validator.isEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Email is not valid',
    });
  }

  if (!userName || !/^[a-zA-Z0-9_-]{4,14}$/.test(userName)) {
    throw createError({
      statusCode: 400,
      message: 'Username must be between 4 and 24 characters',
    });
  }

  const user = await User.findOne({ _id: session._id });
  if (!user) return sendRedirect(event, '/auth', 302);

  const foundByUsername = await User.findOne({ username: body.userName });
  if (foundByUsername && foundByUsername.email !== user.email) {
    throw createError({
      statusCode: 400,
      message: 'Username already taken',
    });
  }

  const foundByEmail = await User.findOne({ email: body.email });

  if (foundByEmail && foundByEmail.email !== user.email) {
    throw createError({
      statusCode: 400,
      message: 'Email уже занят',
    });
  }

  user.username = userName;
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  await user.save();
  return {
    status: 'ok',
  };
});
