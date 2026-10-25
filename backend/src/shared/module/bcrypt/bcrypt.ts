import * as bcrypt from 'bcrypt';

export async function encrypt(plainString: string) {
  const saltRounds = 10;
  const hashedString = await bcrypt.hash(plainString, saltRounds);
  return hashedString;
}

export async function compare(password: string, hashedString: string) {
  const isMatch = await bcrypt.compare(password, hashedString);
  return isMatch;
}

export async function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
