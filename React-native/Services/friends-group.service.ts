import UseApiService, { IDataObject, TokenData } from "./api.service";

const apiService = UseApiService();
export class FriendsGroupService {
  getUsersFromContactsWhichAreOnBoarded(phoneNumbers: string[]) {
    const data: IDataObject = {
      url: "v2/users/from-contacts",
      data: {
        phoneNumbers,
      },
      headerToken: TokenData.ACCESS,
    };
    return apiService.post(data);
  }

  importContacts(phoneNumbers: string[]) {
    const obj: IDataObject = {
      url: "v2/current-user/import-contacts",
      data: {
        phoneNumbers,
      },
      headerToken: TokenData.ACCESS,
    };
    return apiService.post(obj);
  }
}
