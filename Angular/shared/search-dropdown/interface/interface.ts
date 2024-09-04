export interface ISearchQuery {
    limit: number;
    page: number;
    search: string;
    type: string[];
    tags: number[],
}