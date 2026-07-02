import axios from "axios";

const youtube = axios.create({
  baseURL:
    process.env.YOUTUBE_API_BASE_URL ||
    "https://www.googleapis.com/youtube/v3",

  timeout: 60000,
});

export default youtube;