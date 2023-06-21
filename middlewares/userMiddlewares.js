import JWT from "jsonwebtoken";

export const signInFirst = async (req, res, next) => {
  try {
    const verify = JWT.verify(req.headers.authorization, process.env.JWT_TOKEN);
    req.body = verify;
  } catch (error) {
    console.log(error, "Error in the sign in first middleware");
  }
};
