import nodemailer from 'nodemailer';
import createHttpError from "http-errors";
import { getEnvVar } from '../utils/getEnvVar.js';


const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },

});

export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    return info;
  } catch (error) {
    console.log(error);
    throw  createHttpError(500, "Failed to send email, please try again later.");
  }
};
