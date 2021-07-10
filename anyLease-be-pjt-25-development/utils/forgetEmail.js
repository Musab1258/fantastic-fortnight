const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAuth_PLAYGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
  OAuth_PLAYGROUND
);

const forgetPassword = (url, to) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
  });
  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: "noreply@anylease.com",
    to,
    subject: "forget password generator",
    html: `<div style="max-width:700px";margin:auto>
        <h2>Anylease Loan company</h2>
        <p>We have generated a reset password link</p>
        <p>kindly click on the below button to carry out the password reset</p>
        <a href="${url}" style="background:crimson;text-decoration:none;color:white;padding:10px 20px;font-size:15px">click to reset</a>
        <p>if for any reason the above button does not show any sign of response, kindly copy the link below into your favorite browser<p/>
        <div style="font-size:10px;font-style:italic">${url}</div>
        <h3 style="text-align:center;color:grey;font-size:14px">Note:This Link will be valid or active in the next 10 minutes </h3>
        </div>`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) console.log("mail not sent");
    if (info) console.log("mail sent");
  });
};

module.exports = forgetPassword;
