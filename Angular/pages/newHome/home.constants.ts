import { IPriceOrder, ISort, ITokenQuery } from "./interface/home.interface";

export const defaultPagination: ITokenQuery = {
  limit: 18,
  page: 1,
  order: ["-created"],
};

export const sortOptions: ISort[] = [
  { key: "Latest", value: "-created" },
  { key: "Earliest", value: "created" },
  { key: "A-Z", value: "title" },
  { key: "Z-A", value: "-title" },
];

export const priceRangeFilters: IPriceOrder[] = [
  { key: "All" },
  { key: "Low to High", value: "last_price" },
  { key: "High to Low", value: "-last_price" },
];

