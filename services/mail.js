const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
  REFRESH_TOKEN,
  MANAGER_EMAIL,
} = process.env;

const oauth = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
oauth.setCredentials({ refresh_token: REFRESH_TOKEN });

const readFile = promisify(fs.readFile);
const templatePath = path.join(__dirname, "../public/email.html");
const mails = [];

const sendGrouptMail = async () => {
  try {
    // const users = await User.find().lean();

    // for (let i = 0; i < users.length; i += 1) {
    //   mails.push(users[i].email);
    // }
    // 유저 이메일 가져오기

    const accessToken = await oauth.getAccessToken();

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gamil",
      auth: {
        type: "OAuth2",
        user: MANAGER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `FANTASY BASEBALL <${MANAGER_EMAIL}>`,
      bcc: mails,
      subject: "FANTASY BASEBALL",
      html: await readFile(templatePath, "utf-8"),
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendGrouptMail;
