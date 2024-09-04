export interface ITabSelected {
    name: string,
    type: number
    showTable: boolean,
}

export const PROFILE_TAB_TYPE: { [key: string]: ITabSelected } = {
    COLLECTION: { name: "Collected", type: 0, showTable: false },
    CREATED: { name: "Created", type: 1, showTable: false },
    OFFERS: { name: "Offers", type: 2, showTable: true },
    UNLISTED: { name: "Unlisted", type: 3, showTable: false },
    HIDDEN: { name: "Hidden", type: 4, showTable: false }
}
