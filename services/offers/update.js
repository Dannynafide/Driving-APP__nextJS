import Joi from 'joi';

import airDB from 'services/airtableClient';

const schema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().valid('rent', 'sale').required(),
  mobile: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  imageUrl: Joi.string()
});

const update = async (airtableId, payload) => {
  const validatedOffer = await schema.validateAsync(payload);
  const offer = await airDB('offers').update([
    {
      id: airtableId,
      fields: { ...validatedOffer }
    }
  ]);

  return offer;
};

export default update;
