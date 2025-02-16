import { requestAPI } from '@/utils/fetch';

type loginBody = {
  tel: string;
  password: string;
};

const login = async (requestBody: loginBody) => {
  const { data } = await requestAPI().post(
    `/auth/loginWithSessionKey`,
    requestBody
  );
  return data;
};

const logout = async () => {
  const data = await requestAPI().post('/auth/logout');
  return data;
};

const profile = async () => {
  const { data } = await requestAPI().get('/auth/profile');
  return data;
};

type updatePasswordBody = {
  prePassword: string;
  newPassword: string;
};
const changePassword = async (requestBody: updatePasswordBody) => {
  const data = await requestAPI().post(`/auth/changePassword`, requestBody);
  return data;
};

const authAPIList = {
  login,
  logout,
  profile,
  changePassword,
};

export default authAPIList;
