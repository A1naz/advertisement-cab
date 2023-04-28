import { User } from './index';
import { getServerSession } from '#auth';

export default eventHandler(async (event) => {
  const session = (await getServerSession(event)) as any;

  if (!session) return sendRedirect(event, '/auth', 302);

  const user = await User.findOne({ _id: session._id });
  if (!user) return sendRedirect(event, '/auth', 302);

  const client = {
    email: user.email,
    userName: user.email === user.username ? undefined : user.username,
    balance: user.balance,
    firstName: user.firstName,
    lastName: user.lastName,
    password: !!user.password,
  };

  return {
    client,
    status: 'ok',
  };
});
