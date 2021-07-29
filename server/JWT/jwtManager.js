const jwt = require("jsonwebtoken");
const secret = "secret";

class JwtManager {
  //generate token
  generate(data) {
    const token = jwt.sign(data, secret);
    return token;
  }
  // Verify token
  verify(token) {
    const data = jwt.verify(token, secret);
    return data;
  }
}

module.exports = new JwtManager;