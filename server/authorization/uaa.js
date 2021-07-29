const jwtManager = require("../JWT/jwtManager");


class Permission {
  givePermission(req, res, next) {
    if (req.url === "/auth/login" || req.url === "/auth/signup" || req.url === "/auth/admin/login") {
      next();
      return;
    }
    const token = req.headers.authorization;
    if (!token) {
      return res.json("authorization error");
    } else {
      const verifiedToken = jwtManager.verify(token);
      if (!verifiedToken) {
        return res.json("autorization error");
      }
      req.email = verifiedToken.email;
      req.name = verifiedToken.name;
      req.city = verifiedToken.city;
			req.firstName = verifiedToken.firstName;
			req.lastName = verifiedToken.lastName;
			req.driverId = verifiedToken.driverId
			req.gender = verifiedToken.gender
			req.state = verifiedToken.state
			req.address = verifiedToken.address
			req.role = verifiedToken.role
			req.status = verifiedToken.status;
			req.routes = verifiedToken.routes;
			req.invoice = verifiedToken.invoice;
			next()
    }
  }
}

module.exports = new Permission();