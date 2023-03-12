import { Request, Response } from 'express';
import cache from '../../services/cache';
import { RequestParams, RequestPayload, ResponseBody } from '../../types/users.patch.types';
import { isDuplicatePhoneNumber } from '../../utils/duplicate-phone-number';
import { PHONE_NUMBER_TAKEN, USER_NOT_FOUND } from '../../utils/error.utils';

const patchUser = async (req: Request<Record<string, unknown>, Record<string, unknown>, RequestPayload>, res: Response) => {
  const { id } = req.params as RequestParams;
  const payload = req.body;

  const user = cache.getObjectKey<ResponseBody & { deletedAt?: Date }>(id);

  if (!user || user?.deletedAt) {
    res.status(USER_NOT_FOUND.status).send({ error: USER_NOT_FOUND.message });

    return;
  }

  // When the user tries to update the country code or phone number
  if (payload.countryCode || payload.phoneNumber) {
    // We do not want to allow users to register the same phone number
  // However we do allow the same name, date of birth and address
    if (isDuplicatePhoneNumber(payload.countryCode || user?.countryCode, payload.phoneNumber || user.phoneNumber)) {
      res.status(PHONE_NUMBER_TAKEN.status).send({ error: PHONE_NUMBER_TAKEN.message });

      return;
    }
  }

  const updatedUser = { ...user, ...payload };

  cache.setKey(id, JSON.stringify(updatedUser));

  res.json(updatedUser);
};

export default patchUser;