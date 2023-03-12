export type RequestParams = {
  id: string;
};
export type RequestQuery = void;
export type RequestPayload = void;
export type ResponseBody = {
  id: string;
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