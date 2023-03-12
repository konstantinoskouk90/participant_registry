import { Request, Response } from 'express';
import cache from '../../services/cache';
import { generateReferenceId } from '../../utils/id-generator';
import { RequestPayload } from '../../types/users.post.types';
import { PHONE_NUMBER_TAKEN } from '../../utils/error.utils';
import { isDuplicatePhoneNumber } from '../../utils/duplicate-phone-number';

const postUser = async (req: Request<Record<string, unknown>, Record<string, unknown>, RequestPayload>, res: Response) => {
  const { firstName, lastName, countryCode, phoneNumber } = req.body;

  // We do not want to allow users to register the same phone number
  // However we do allow the same name, date of birth and address
  if (isDuplicatePhoneNumber(countryCode, phoneNumber)) {
    res.status(PHONE_NUMBER_TAKEN.status).send({ error: PHONE_NUMBER_TAKEN.message });

    return;
  }

  const id = generateReferenceId(firstName, lastName, cache.listKeys().length);

  const response = { id, ...req.body };

  cache.setKey(id, JSON.stringify(response));

  res.json(response);
};

export default postUser;