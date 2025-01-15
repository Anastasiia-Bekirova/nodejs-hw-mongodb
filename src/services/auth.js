import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { randomBytes } from "crypto";

import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";

import { accessTokenLifetime, refreshTokenLifetime} from "../constants/users.js";
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from "../constants/index.js";

const createSessionData = () => ({
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async payload => {
    const { email, password } = payload;
    const user = await UserCollection.findOne({ email });
    if (user) {
        throw createHttpError(409, "User already exists!");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await UserCollection.create({...payload, password: hashPassword});

    return newUser;
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
    const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
    );

    const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });


};


export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
  await SessionCollection.deleteOne({ userId: user._id });
};

export const login = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Email or password is invalid!");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Email or password is invalid!");
    };

    await SessionCollection.deleteOne({ userId: user._id });

    const sessionData = createSessionData();

    return SessionCollection.create({
        userId: user._id,
        ...sessionData,
    });
};

export const refreshToken = async (payload) => {
    const oldSession = await SessionCollection.findOne({
        _id: payload.sessionId,
        refreshToken: payload.refreshToken,
    });
    if (!oldSession) {
        throw createHttpError(401, "Session is not found");
    }
    if (Date.now() > oldSession.refreshTokenValidUntil) {
       throw createHttpError(401, "Refresh token expired");
    }
    await SessionCollection.deleteOne({ _id: payload.sessionId });


    const sessionData = createSessionData();

    return SessionCollection.create({
        userId: oldSession.userId,
        ...sessionData,
    });

};

export const logout = async sessionId => {
    await SessionCollection.deleteOne({ _id: sessionId });
 };

export const getUser = filter => UserCollection.findOne(filter);

export const getSession = filter => SessionCollection.findOne(filter);


