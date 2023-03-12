import { Request, Response } from 'express';
import cache from '../../services/cache';
import { RequestParams, RequestPayload, ResponseBody } from '../../types/users.get.types';
import { USER_NOT_FOUND } from '../../utils/error.utils';

const getUser = async (req: Request<Record<string, unknown>, Record<string, unknown>, RequestPayload>, res: Response) => {
  const { id } = req.params as RequestParams;

  const user = cache.getObjectKey<ResponseBody & { deletedAt?: Date }>(id);

  if (!user || user?.deletedAt) {
    res.status(USER_NOT_FOUND.status).send({ error: USER_NOT_FOUND.message });

    return;
  }

  res.json(user);
};

export default getUser;