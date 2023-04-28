export const userTransformer = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};
