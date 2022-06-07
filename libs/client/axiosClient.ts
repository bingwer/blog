import axios from 'axios';

const axiosClient = axios.create({
  timeout: 5000,
});

export const axiosFetcher = (url: string) =>
  axiosClient.get(url).then(res => res.data);

export default axiosClient;
