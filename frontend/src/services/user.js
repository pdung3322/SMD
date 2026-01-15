import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function getUsers() {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
}
