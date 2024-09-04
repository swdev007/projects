export enum VIDEO_COMPONENT_TYPE {
    VIDEO = 'VIDEO',
    BANNER = 'BANNER',
    VIDEO_WITH_STARTING_IMAGE = 'VIDEO_WITH_STARTING_IMAGE',
    VIDEO_WITH_POSTER_IMAGE = 'VIDEO_WITH_POSTER_IMAGE',
    VIDEO_CARD_PLAYING = 'VIDEO_CARD'
}

export enum MEDIA_UPLOAD_TYPE {
    VIDEO_OR_AUDIO = 'video/audio',
    IMAGE = 'image',
}

export enum USERTYPE {
    ARTIST = 'artist',
    COLLECTOR = 'collector',
    COLLECTOR_INVITE = 'collector_invite',
}

export enum StorageKeys {
    ACCESS_TOKEN_ARTIST = 'access_artist',
    REFRESH_TOKEN_ARTIST = 'refresh_artist',
    ACCESS_TOKEN_COLLECTOR = 'access_collector',
    REFRESH_TOKEN_COLLECTOR = 'refresh_collector',
    USER_ID = 'user_id'
}