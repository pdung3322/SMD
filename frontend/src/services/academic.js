import api from "./api";

export const getCurrentSemester = async () => {
  const res = await api.get("/academic/current-semester"); // ✅ ĐÚNG
  return res.data;
};
