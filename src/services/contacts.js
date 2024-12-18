import ContactCollection from "../db/models/Contact.js";


export const getContacts = () => ContactCollection.find();

export const getContactById = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
    const { upsert = false } = options;
    const result = await ContactCollection.findOneAndUpdate(
        {_id},
        payload,
        {
            new: true,
            upsert,

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
