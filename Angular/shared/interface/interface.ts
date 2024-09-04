export interface IConfirmationPopup {
    heading: string,
    subheading: string
}

export interface ITokenList {
    count: number;
    next: string;
    previous: string;
    results: ITokenResult[];
}

export interface ICreator {
    public_address: string;
    image: string;
    username: string;
}

export interface ITokenResult {
    cover_image: string;
    creator: ICreator;
    description: string;
    is_hidden: boolean;
    is_listed: boolean;
    is_mine: boolean;
    is_minted: boolean;
    nft_file: string;
    owner: ICreator;
    price: number;
    tags: string[];
    title: string;
    uuid: string;
    name?: string;
    hover?: boolean;
    username?: string;
}

export interface IOwner {
    bio?: string,
    cover?: string,
    createdAt?: string,
    dateJoined?: string,
    deletedAt?: string,
    email: string,
    firstName: string,
    id: string,
    image: string,
    instagramUrl?: string,
    inviteLinkId?: string,
    isActive?: boolean,
    isStaff?: boolean,
    isSuperUser?: boolean,
    lastName?: string,
    password?: string,
    publicAddress?: string,
    role?: string,
    twitterUrl?: string,
    updatedAt?: string,
    username?: string,
}

export interface ITokensList {
    data: IToken[],
    totalCount: number
}
export interface IToken {
    cover_image_key?: string
    created_at?: string
    description?: string
    drop_date?: string,
    dropDate?: string,
    id?: string
    is_featured?: boolean
    nft_file_key?: string
    owner_id?: string
    title?: string
    username?: string
    uuid: string
    vertical_video?: string,
    owner?: IOwner,
    hover?: boolean,
    is_hidden?: boolean;
    is_listed?: boolean;
    is_mine?: boolean;
    is_minted?: boolean;
    price?: number;
    coverImageKey?: string;
    nftFileKey?: string;
    verticalCoverImage?: string;
    createdAt?: string,
    tokenId: string,
    tag?: any[],
    tokenUri?: string,
    whitelist_drop_date?: string,
    whiteListDropDate?: string,
    vertical_cover_image?: string,
    totalTokenCount?: number,
    tagName?: string,
    publicAddress?: string,
    verticalVideoStream?: string,
    nftFileKeyStream?: string,
    updated_at?: string,
    updatedAt?: string,
    ethRaised?:string,
    isListed?:boolean,
    sales?: number,
    autoplay?: boolean,
    nftFileKeyGif? : string
    
}

export interface IFeaturedVideo {
    coverImageKey: string,
    createdAt?: string,
    creatorId?: string,
    deletedAt?: string | null,
    description: string,
    dropDate: string,
    id: string,
    isFeatured?: boolean,
    isHidden?: boolean,
    isListed?: boolean,
    isMinted?: boolean,
    kind?: string,
    mintUri?: string,
    nftFileKey: string
    owner?: IOwner
    ownerId: string,
    price: number,
    title: string,
    tokenId: number,
    tokenUri?: string,
    updatedAt?: string,
    uuid: string,
    verticalVideo?: string,
    verticalCoverImage?: string | null,
    whiteListDropDate?: string | null,
    tag: any[],
    smallDescription?: string
    totalTokenCount?: number,
    sales?: number,
    username? : string,
    verticalVideoStream?: string,
    nftFileKeyStream?: string,
    ethRaised? : string,
    bought?: boolean,
    mobileDescription?: string;
    creator?: any,
    publicAddress? :any,
    autoplay?: boolean,
    nftFileKeyGif?: string,

}
export interface ICounter {
    [key: string]: string
}

export interface INotification {
    type: string,
    message: string,
    to?: string,
    date?: string,
    timeOut: number,
    link?: string,
    link_text?: string
}
export interface IConfirm {  
   heading : string,
   subheading: string
}