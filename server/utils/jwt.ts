import jwt from 'jsonwebtoken';

const generateAccessToken = async (user: any) => {
  const config = useRuntimeConfig();
  return jwt.sign({ userId: user.id.valueOf() }, config.jwtAccessSecret, {
    expiresIn: '50m',
  });
};

const generateRefreshToken = async (user: any) => {
  const config = useRuntimeConfig();

  return jwt.sign({ userId: user._id.valueOf() }, config.jwtRefreshSecret, {
    expiresIn: '24h',
  });
};

export const generateTokens = async (user: any) => {
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const sendRefreshToken = async (event: any, token: string) => {
  setCookie(event, 'refresh_token', token, {
    httpOnly: true,
    sameSite: true,
  });
};
