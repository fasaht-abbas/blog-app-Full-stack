import axios from "axios";
// refreshing the tokens ....
export const refreshing = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/user/refresh`,
      {
        withCredentials: true,
      }
    );
    if (data?.success) {
      return {
        user: data?.user,
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
