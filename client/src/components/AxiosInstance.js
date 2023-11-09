import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import jwt_Decode from "jwt-decode";
import { refreshing } from "./Utlis";

const CreatePrivateInstance = () => {
  const [auth, setAuth] = useAuth();

  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = auth?.accessToken;

      if (accessToken && accessToken !== "") {
        const tokenExp = jwt_Decode(accessToken).exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const tokenLifetime = tokenExp - currentTimestamp;

        if (tokenLifetime < 30) {
          const refreshedToken = await refreshing();

          config.headers.Authorization = refreshedToken?.accessToken;
          setAuth({
            ...auth,
            user: refreshedToken?.user,
            accessToken: refreshedToken?.accessToken,
          });
        } else {
          config.headers.Authorization = auth?.accessToken;
        }
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default CreatePrivateInstance;
