/**
 * 本地存储Key常量
 */

export enum EnumLocalStorageKey {
    CHANNEL_ID = "channelId",
    PUBLIC_IP = "LocalIpCacheKey",
    // music
    MUSIC_VIRATE = "music_virate",
    MUSIC_VOLUMN = "music_volumn",
    SOUND_VOLUMN = "sound_volumn",
    // account
    ACCOUNT_LIST = "ACCOUNT_LIST",
    RESET_PASS_CODE_TIME = "RESET_PASS_CODE_TIME",
    BIND_PHONE_CODE_TIME = "BIND_PHONE_CODE_TIME",
    LAST_RESET_ACCOUNT_PASS_TIME = "LAST_RESET_ACCOUNT_PASS_TIME",
    LAST_RESET_AVATAR_TIME = "LAST_RESET_AVATAR_TIME",
    // safeBox
    LAST_SAVE_TIME = "LAST_SAVE_TIME",
    LAST_DRAW_TIME = "LAST_DRAW_TIME",
    LAST_RESET_SAFE_PASS_TIME = "LAST_RESET_SAFE_PASS_TIME",
    // update
    FILEUTILS_SEARCH_PATHS = "FILEUTILS_SEARCH_PATHS",
    ASSETS_UPDATE_LAST_FINISH_TIME = "ASSETS_UPDATE_LAST_FINISH_TIME",
    // customer service
    READED_NOTICE_ID_LIST = "READED_NOTICE_ID_LIST",
}