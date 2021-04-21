const createError = require("http-errors");
const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const { googleToken, profile } = res.locals;
    const { name, email, picture } = profile;

    let user = await User.findOne({ email });
    let isInitialLogin = false;

    if (!user) {
      user = await User.create({
        name,
        email,
        money: 5000,
        imageUrl: picture,
      });

      isInitialLogin = true;
    }

    res.cookie("access_token", googleToken);

    res.status(200).json({
      result: "ok",
      data: {
        name: user.name,
        email: user.email,
        money: user.money,
        imageUrl: user.image_url,
      },
      isInitialLogin,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("access_token");
  res.status(200).json({ result: "ok" });
};

exports.checkUser = async (req, res, next) => {
  console.log(res.locals.profile);
  try {
    const { email } = res.locals.profile;
    const user = await User.findOne({ email });

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
