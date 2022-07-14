const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

const isExpired = (decodedToken) => {
  const currentTime = new Date().getTime() / 1000;

  return decodedToken.exp < currentTime;
};

module.exports = { parseJwt, isExpired };
