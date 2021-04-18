const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
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

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        money: 5000,
        image_url: picture,
      });
    }

    const token = jwt.sign({
      _id: user._id,
      name: user.name,
      email: user.email,
    }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("@token", token);

    res.status(200).json({
      result: "ok",
      data: {
        name: user.name,
        email: user.email,
        money: user.money,
        imageUrl: user.image_url,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("@token");
  res.status(200).json({ result: "ok" });
};
