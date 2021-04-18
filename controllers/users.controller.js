const { OAuth2Client } = require("google-auth-library");

exports.login = async (req, res, next) => {
  try {
    const googleToken = req.headers.authorization.split(" ")[1];
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();
  } catch (err) {
    next(err);
  }
};
