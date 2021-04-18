const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    next(err);
  }
};

exports.authenticateUser = authenticateUser;
