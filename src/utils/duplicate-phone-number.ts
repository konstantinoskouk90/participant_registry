import cache from '../services/cache';
import { ResponseBody } from '../types/users.post.types';

export function isDuplicatePhoneNumber(countryCode: string, phoneNumber: number) {
  return cache.listKeys().some((key) => {
    const user = cache.getObjectKey<ResponseBody & { deletedAt: Date }>(key);

    if (!user || user.deletedAt) {
      return false;
    }

    const userPhoneNumber = `${user.countryCode}${user.phoneNumber}`;
    const newUserPhoneNumber = `${countryCode}${phoneNumber}`;

    if (userPhoneNumber === newUserPhoneNumber) {
      return true;
    }

    return false;
  });
}