import multer from 'multer';
import createHttpError from 'http-errors';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb)=> {
    const extention = file.originalname.split(".").pop();
    if(extention === "exe") {
        return cb(createHttpError(400, "File with .exe extention is not allowed"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits,
    fileFilter,
});
