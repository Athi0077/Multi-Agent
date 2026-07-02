import api from "./api";

export const startConversation = async () => {
  const res = await api.post("/chat/start");

  return res.data;
};

export const getHistory = async () => {
  const res = await api.get("/chat/history");

  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/chat/message", data);

  return res.data;
};

export const getConversation = async (id) => {
  const res = await api.get(`/chat/${id}`);
  return res.data;
};

export const renameConversation = async (id, title) => {
  const res = await api.patch(`/chat/${id}/rename`, { title });
  return res.data;
};

export const deleteConversation = async (id) => {
  const res = await api.delete(`/chat/${id}`);
  return res.data;
};