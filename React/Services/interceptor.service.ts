import Axios from "axios";
import { getToken } from "./token.service";

export const interceptor = () => {
  Axios.interceptors.request.use(
    async (req: any) => {
      let headerToken = req.data?.headerToken;
      if (headerToken) {
        req.data.headerToken = undefined;
      }
      if (headerToken && Object.keys(req?.data ?? {}).length === 1) {
        req.data = undefined;
      }
      if (headerToken === "ACCESS") {
        const token = await getToken(headerToken);
        req.headers["Authorization"] = token;
      } else if (headerToken === "REFRESH") {
        const token = await getToken(headerToken);
        req.headers.refresh = token;
      }
      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};
