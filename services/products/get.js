import airDB from 'services/airtableClient';

const get = async (airtableId) => {
  const product = await airDB('products').find(airtableId);

  if (product) {
    return { id: product.id, ...product.fields };
  }

  return product;
};

export default get;
