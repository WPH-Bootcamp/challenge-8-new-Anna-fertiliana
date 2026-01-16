import { api } from "./api";

export const requestToken = async () => {
  const { data } = await api.get("/authentication/token/new");
  return data.request_token;
};

export const createSession = async (requestToken: string) => {
  const { data } = await api.post("/authentication/session/new", {
    request_token: requestToken,
  });
  return data.session_id;
};

export const getAccount = async (sessionId: string) => {
  const { data } = await api.get("/account", {
    params: { session_id: sessionId },
  });
  return data.id;
};
