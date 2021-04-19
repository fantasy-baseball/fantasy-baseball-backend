const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const { googleToken, profile } = res.locals;
    const { name, email, picture } = profile;

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

    res.cookie("token", token);

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
  res.clearCookie("token");
  res.status(200).json({ result: "ok" });
};
