import { RefreshToken } from '~/server/api/users/token';

export const createRefreshTocken = async (refreshToken: any) => {
  const findOneToken = await RefreshToken.findOne({
    userId: refreshToken.userId,
  });

  if (!findOneToken) {
    return await RefreshToken.create(refreshToken);
  } else {
    return await RefreshToken.findOneAndUpdate(
      { userId: refreshToken.userId },
      { token: refreshToken.token }
    );
  }
};
