import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { API } from "src/app/model/api.model";
import { ApiService } from "src/app/services/api.service";
import { defaultPagination } from "./home.constants";
import { IArtistsResponse, ITokenQuery } from "./interface/home.interface";
import { IFeaturedVideo, ITokensList } from '@shared/interface/interface';
import { NftTokenService } from "src/app/services/nft-token.service";
@Injectable({
  providedIn: "root",
})
export class HomeService {
  paginatorSubject: BehaviorSubject<ITokenQuery> =
    new BehaviorSubject<ITokenQuery>(defaultPagination);

  constructor(private apiService: ApiService, private nftTokenService: NftTokenService) { }

  updatePaginatorSubject(data: ITokenQuery) {
    const filters = this.paginatorSubject.value;
    this.paginatorSubject.next({ ...filters, ...data });
  }

  gettHeaders() {
    const publicAddress = this.nftTokenService.getPublicAddressIfPresent();
    if (publicAddress)
      return { authorization: publicAddress };
    else return;
  }

  getTokenList(params: ITokenQuery) {
    const headers = this.gettHeaders();
    return this.apiService.get<ITokensList>(API.tokensList, {
      ...params
    }, headers);
  }

  getArtists(params?: { search: string }) {
    return this.apiService.getOld<IArtistsResponse>(API.artists, {
      ...params,
    });
  }

  getArtWork(params?: {}) {
    const headers = this.gettHeaders();
    return this.apiService.get<IFeaturedVideo>(API.artwork, {
      ...params,
    }, headers);
  }
}
