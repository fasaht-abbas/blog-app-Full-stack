import bcrypt from "bcrypt";

export const hashpassowrd = async (password) => {
  try {
    let saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error, "Error in hasing the password");
  }
};

export const comparePassword = async (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};
