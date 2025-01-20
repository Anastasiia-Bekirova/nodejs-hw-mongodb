import express from "express";
import cors from "cors";
import pino from "pino-http";
import cookieParser from "cookie-parser";

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import { swaggerDocs } from "./middlewares/swaggerDocs.js";

import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";


import { getEnvVar } from "./utils/getEnvVar.js";

import { UPLOAD_DIR } from "./constants/index.js";

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(pino({
        transport: {
             target: "pino-pretty"
        }
    }));

    app.use("/uploads", express.static(UPLOAD_DIR));
    app.use("/auth", authRouter);
    app.use("/contacts", contactsRouter);
    app.use("/api-docs", swaggerDocs());

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));

};
