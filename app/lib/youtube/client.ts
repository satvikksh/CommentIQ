import axios from "axios";

const youtube = axios.create({
  timeout: 60000,
});

export default youtube;
