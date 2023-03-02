import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

export const sendMail = async <T extends string>(
  DESTINATION: string,
  SUBJECT: T,
  HTMLBODY: T,
  MESSAGE: T
) => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    //etheral SMTP
    let transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // using STARTTLS SECURITY by default
      auth: {
        user: testAccount.user, // ethereal user
        pass: testAccount.pass, // ethereal password
      },
    });
    // user SMTP
    let UserTransporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // using STARTTLS SECURITY by default
      auth: {
        user: `${EMAIL_USER}`, // ethereal user
        pass: `${EMAIL_PASS}`, // ethereal password
      },
    });
    // sending the mail
    let info = await transporter.sendMail({
      from: `${EMAIL_USER}`,
      to: `${DESTINATION}`,
      subject: `${SUBJECT}`,
      text: `${MESSAGE}`,
      html: `${HTMLBODY}`,
    });

    console.log(info);

    return info;
  } catch (error) {
    throw createError.Unauthorized(`${error}`);
  }
};

// for using email in node with express fundamentally there are three key steps
// 1) creating a nodemailer Transporter like SMTP , AWS, GCS and a whole lot more
// 2) providing the mail configuration object
// 3) using sendmail method from nodemailer to send the mail
