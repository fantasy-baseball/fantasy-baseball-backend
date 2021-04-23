const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const mails = [];
// TODO: DB에서 유저 이메일 가져오기
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
  REFRESH_TOKEN,
} = process.env;

const oauth = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
oauth.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendBettingStartMail = async () => {
  try {
    const accessToken = await oauth.getAccessToken();

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gamil",
      auth: {
        type: "OAuth2",
        user: "solhanyun@gmail.com",
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: "FANTASY BASEBALL <solhanyun@gmail.com>",
      to: mails,
      subject: "FANTASY BASEBALL",
      text: "베팅이 시작되었습니다",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendBettingStartMail;
