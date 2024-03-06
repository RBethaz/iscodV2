const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "No token provided";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);

    // Vérifiez si nous sommes en mode test
    if (process.env.NODE_ENV === "test") {
      // En mode test, utilisez les données décodées directement
      req.user = decoded;
    } else {
      // En mode normal, récupérez l'utilisateur de la base de données
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
    }

    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
