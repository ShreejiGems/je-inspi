export const generateOTP = (): string => {
  const characters = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += characters[Math.floor(Math.random() * characters.length)];
  }
  return OTP;
};

export const generateReferenceCode = (): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referenceCode = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    referenceCode += charset[randomIndex];
  }
  return referenceCode;
};
