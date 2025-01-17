import {Router} from "express";

import * as contactsController from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";

import { validateBody } from "../utils/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";



const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(contactsController.getContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(contactsController.getContactByIdController));

contactsRouter.post("/", upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactsController.addContactController));

contactsRouter.patch("/:id", isValidId, upload.single("photo"), validateBody(contactUpdateSchema), ctrlWrapper(contactsController.patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(contactsController.deleteContactController));

export default contactsRouter;
