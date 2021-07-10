const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
require("dotenv").config();

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
  OAUTH_PLAYGROUND
);

const sendEmail = (to, url, name) => {
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
    subject: "Anylease Loan company",
    from: "noreply@anylease.com",
    to,
    html: `
    <div
        style="max-width:700px;margin:auto;border:10px solid;padding:50px 20px; font-size:20px;align-items:center;box-shadow: 10px 10px 10px red;">
        <h2 class="active" style="text-align:center;padding:15px 20px;text-transform:uppercase; color:crimson">Welcome to AnyLease</h2>
        <p>Congratulation! ${name} You're almost set to start using anyLease .</p>
        <p style="font-size:16px;margin-top: 1px;">Just click on the button below to validate your email address</p>
        <a  href="${url}" style="background:crimson;text-decoration:none;color:white;padding:10px 20px;font-size:15px ">sign
            in to validate your email</a>
        <p style="margin-top:50px">if the button does not work for any reason, you can also paste the link below into your browser</p>
        <div style="font-size:10px;font-style:italic">${url}</div>
        <h3 style="text-align:center;color:grey;font-size:14px">Note:You must perform this validation within the next 12 minutes to keep your account enabled</h3>
    </div>`,
  };
  //
  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) console.log(`failed ${err}`);
    if (info) console.log(`mail sent successfully`);
  });
};

module.exports = sendEmail;
