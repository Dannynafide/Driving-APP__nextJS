import createCheckout from 'services/checkout/create';

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const orderItem = req.body;
        const checkout = await createCheckout(orderItem);

        res.status(200).json({ status: 'created', checkout });
      } catch (error) {
        res.status(422).json({ status: 'not_created', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
