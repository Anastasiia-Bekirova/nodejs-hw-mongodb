import createHttpError from "http-errors";

import * as contactServices from "../services/contacts.js";

import { saveFileToUploadDir } from "../utils/saveFileToUploadsDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sortByList } from "../db/models/Contact.js";
import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";



export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilterParams(req.query);

    filter.userId = req.user._id;


    const data = await contactServices.getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });

};


export const getContactByIdController = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: _id } = req.params;
    const data = await contactServices.getContact({_id, userId});

    if (!data) {
        throw createHttpError(404, `Contact not found`);

    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${_id}!`,
        data,
    });

};

export const addContactController = async (req, res) => {
    const cloudinaryEnable = getEnvVar("CLOUDINARY_ENABLE") === "true";
    let photo;
    if (req.file) {
        if(cloudinaryEnable) {
            photo = await saveFileToCloudinary(req.file);
        }
        else {
            photo = await saveFileToUploadDir(req.file);
        }

    }

    const { _id: userId } = req.user;
    const data = await contactServices.addContact({...req.body, photo, userId});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res) => {

    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServices.updateContact({_id, userId}, req.body);

    if (!result) {
        throw createHttpError(404, `Contact not found`);

    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.data,
    });
};

export const deleteContactController = async(req, res)=> {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.deleteContact({_id, userId});

    if(!data) {
        throw createHttpError(404, `Contact not found`);
    }

    res.status(204).send();
};
