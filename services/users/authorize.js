import crypto from 'crypto';
import Joi from 'joi';

import airDB from 'services/airtableClient';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authorize = async (payload) => {
  const { email, password } = await schema.validateAsync(payload);

  const [user] = await airDB('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (!user) {
    return null;
  }

  const passwordHash = crypto
    .pbkdf2Sync(password, user.fields.passwordSalt, 1000, 64, `sha512`)
    .toString(`hex`);

  if (passwordHash !== user.fields.passwordHash) {
    return null;
  }

  return {
    id: user.id,
    email: user.fields.email,
    fullName: user.fields.fullName,
    role: user.fields.role
  };
};

export default authorize;
