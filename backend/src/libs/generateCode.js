//generateCode.js - Generates unique short codes for certificates, invites, or public verification tokens.


import crypto from 'crypto';

const  generateUniqueCode = (length = 8) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

export default generateUniqueCode;
