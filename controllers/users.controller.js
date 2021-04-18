const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const googleToken = req.headers.authorization.split(" ")[1];
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    const user = await User.findOne({ email });
  } catch (err) {
    next(err);
  }
};
