import bcrypt from "bcrypt";

export const hash = async (string: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(string, saltRounds);
  return hashedPassword;
};

export const compareHash = async (string: string, hash: string): Promise<boolean> => {
  console.log(string, hash);
  const isCompared = await bcrypt.compare(string, hash);
  return isCompared;
};
