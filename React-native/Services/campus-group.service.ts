import branch from "react-native-branch";
import UseApiService, { IDataObject, TokenData } from "./api.service";

const apiService = UseApiService();
export class CampusGroupService {
  getInvitations(accessToken: string) {
    const obj: IDataObject = {
      url: "v2/current-user/campus-group-invitations",
      headers: {
        Authorization: accessToken,
      },
    };
    return apiService.get(obj);
  }

  getInvitationsWithoutToken() {
    const obj: IDataObject = {
      url: "v2/current-user/campus-group-invitations",
      headerToken: TokenData.ACCESS,
    };
    return apiService.get(obj);
  }

  redeemInvitation(invitationId: string) {
    const obj: IDataObject = {
      url: `v2/current-user/campus-group-invitations/${invitationId}/redeem`,
      headerToken: TokenData.ACCESS,
    };
    return apiService.post(obj);
  }

  //   MYSS-2125:[Android] Implement society page branch link
  async getCommunityFromBranchLink(params?: any): Promise<string> {
    try {
      if (!params) {
        params = await branch.getLatestReferringParams(true);
      }

      const url = new URL((params?.["+non_branch_link"] || "") as string);
      // ADDED TO CHECK FOR SOCIETIES
      if (url.pathname.includes("societies")) {
        const arr = url.pathname.split("/");
        return arr[arr.length - 1];
      }
      return "";
    } catch (error) {
      return "";
    }
  }
}
