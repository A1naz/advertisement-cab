import { sendError } from 'h3';
import { User } from './index';
import bcrypt from 'bcryptjs';
import { userTransformer } from '~/server/transformers/user';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password, repeatPassword } = body;

  if (!email || !password || !repeatPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите все данные!',
    });
  }

  if (password != repeatPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пароли не совпадают!',
    });
  }

  const hashPassword = await bcrypt.hashSync(password, 7);

  const userData = {
    email,
    password: hashPassword,
  };

  const isUserExist = await User.findOne({ email: email });

  if (isUserExist) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пользователь с таким email уже существует!!',
    });
  }

  const user = await User.create(userData);

  return userTransformer(user);
});
