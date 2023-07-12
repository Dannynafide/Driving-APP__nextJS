import airDB from 'services/airtableClient';

const getFeatured = async (maxRecords) => {
  const offers = await airDB('offers')
    .select({
      view: 'featured',
      maxRecords
    })
    .firstPage();

  return offers.map((offer) => offer.fields);
};

export default getFeatured;
