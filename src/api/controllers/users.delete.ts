import { Request, Response } from 'express';
import cache from '../../services/cache';
import { RequestParams, RequestPayload, ResponseBody } from '../../types/users.delete.types';
import { USER_NOT_FOUND } from '../../utils/error.utils';

const deleteUser = async (req: Request<Record<string, unknown>, Record<string, unknown>, RequestPayload>, res: Response) => {
  const { id } = req.params as RequestParams;

  const user = cache.getObjectKey<ResponseBody & { deletedAt?: Date }>(id);

  if (!user || user?.deletedAt) {
    res.status(USER_NOT_FOUND.status).send({ error: USER_NOT_FOUND.message });

    return;
  }

  const deletedUser = { ...user, deletedAt: new Date() };

  cache.setKey(id, JSON.stringify(deletedUser));

  res.json({ message: 'OK' });
};

export default deleteUser;