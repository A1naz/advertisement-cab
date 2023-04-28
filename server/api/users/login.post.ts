import { User } from './index';
import bcrypt from 'bcryptjs';
import { createRefreshTocken } from '~/server/db/refreshToken';
import { userTransformer } from '~/server/transformers/user';
import { generateTokens, sendRefreshToken } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Введите все данные!',
      })
    );
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Неправильные логин или пароль',
      })
    );
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Неправильные логин или пароль',
      })
    );
  } else {
    const { accessToken, refreshToken } = await generateTokens(user);

    await createRefreshTocken({
      token: refreshToken,
      userId: user._id,
    });

    sendRefreshToken(event, refreshToken);

    return {
      access_token: accessToken,
      user: userTransformer(user),
    };
  }
});
