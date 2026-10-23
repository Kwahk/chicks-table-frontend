import { api } from "./client";

export const getScraps = () => api.get("/scrap").then((res) => res.data.scraps);

export const getScrap = (id) => api.get(`/scrap/${id}`).then((res) => res.data);

export const createScrap = (title, contents) =>
  api.post("/scrap", { title, contents });

export const deleteScrap = (id) => api.delete(`/scrap/${id}`);
