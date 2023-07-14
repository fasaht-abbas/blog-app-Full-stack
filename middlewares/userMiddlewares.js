import JWT from "jsonwebtoken";

export const signInFirst = async (req, res, next) => {
  try {
    JWT.verify(
      req.headers.authorization,
      process.env.JWT_Access_TOKEN,
      (err, user) => {
        if (err) {
          return res.status(401).send("invalid token");
        }
        req.body = user;
        next();
      }
    );
  } catch (error) {
    console.log(error, "Error in the sign in first middleware");
  }
};
