import axios from "axios";
const IP = '10.87.169.81'
const api = axios.create({
  baseURL: `http://${IP}:8080`,
});
export default api;
