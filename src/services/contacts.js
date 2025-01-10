import ContactCollection from "../db/models/Contact.js";
import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({
  page=1,
  perPage=10,
  sortBy = "_id",
  sortOrder = "asc",
  filter = {},
  }) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contactsQuery = ContactCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
   if (filter.isFavourite) {
   contactsQuery.where('isFavourite').equals(filter.isFavourite);
   }

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  const totalItems = await ContactCollection.find().merge(contactsQuery).countDocuments();

  const data = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder});


  const paginationData = calcPaginationData(totalItems, page, perPage );

  return {
    data,
    totalItems,
    ...paginationData,

  };

};

export const getContactById = id => ContactCollection.findById(id);

export const getContact = filter => ContactCollection.findOne(filter);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async (filter, payload, options = {}) => {
    const { upsert = false } = options;
    const result = await ContactCollection.findOneAndUpdate(
        filter,
        payload,
        {
          new: true,
          upsert,
          runValidators: true,

        },
    );
    if (!result) return null;

    const isNew = upsert && result.isNew;

    return {
        isNew,
        data: result,
    };
};

export const deleteContact = async (id) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: id,
  });

  return contact;
};
