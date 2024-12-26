import { contactTypeList } from "../../constants/contacts.js";

const parseType = (type) => {
  if (typeof type !== 'string') return undefined;
  return contactTypeList.includes(type) ? type : undefined;
};

const parseIsFavourite = (isFavourite) => {
  return typeof isFavourite === 'boolean' ? isFavourite : undefined;
};

export const parseContactFilterParams = (query) => {
    const { type, isFavourite } = query;



    return {
        type: parseType(type),
        isFavourite: parseIsFavourite(isFavourite),
    };

 };
