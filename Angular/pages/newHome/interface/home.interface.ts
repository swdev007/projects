export interface ITokenQuery {
  creator?: Array<string> | string;
  limit?: number;
  page?: number;
  order?: [TokenOrder, TokenOrder?] | string;
  owner?: string;
}

export type TokenOrderSort = "-created" | "created" | "title" | "-title";

export type TokenOrderPrice = "last_price" | "-last_price";

export type TokenOrder = TokenOrderSort | TokenOrderPrice;

export interface ISort {
  key: string;
  value: TokenOrderSort;
}

export interface IPriceOrder {
  key: string;
  value?: TokenOrderPrice;
}

export interface IArtistsResponse {
  count: number;
  next: string;
  previous: string;
  results: IArtistItem[];
}

export interface IArtistItem {
  uuid?: string;
  username: string;
}
export interface ISortOrder {
  type: number;
  action: string;
}

