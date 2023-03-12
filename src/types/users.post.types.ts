export type RequestParams = void;
export type RequestQuery = void;
export type RequestPayload = {
  firstName: string;
  lastName: string;
  countryCode: string;
  dateOfBirth: string;
  phoneNumber: number;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
};
export type ResponseBody = RequestPayload & {
  id: string;
};