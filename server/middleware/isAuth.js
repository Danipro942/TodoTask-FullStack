const { decode } = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.get("Authorization"));
  const token = req.get("Authorization").split(" ")[1];
  if (!token) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    next(error);
  }
  let DecodedToken;
  try {
    DecodedToken = JWT.verify(token, process.env.JWT_KEY);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }

  if (!DecodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    next(error);
  }

  console.log(DecodedToken);
  req.userId = DecodedToken._id;
  next();
};
