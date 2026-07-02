import axios from "axios";

const openRouter = axios.create({
  baseURL:
    process.env.OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1",

  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },

  timeout: 120000,
});

export default openRouter;