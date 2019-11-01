import NativeBridge from "../../Utils/NativeBridge";
import LocalStorage from "../../Utils/LocalStorage";
import { EnumLocalStorageKey } from "../Enum/EnumLocalStorageKey";
import Global from "../Global";
import Logger from "../../Utils/Logger";

/**
 * 新的音乐管理器
 */

export default class AudioManager {

    playingBackgroundMusic: number = -1;      // 播放中的背景音乐ID
    playingSoundList = [];         // 播放中的音效
    playingMusicList: number[] = [];         // 播放中的音乐

    musicVolumn: number = 1;                // 音乐音量
    soundVolumn: number = 1;                // 音效音量
    isVirate: boolean = false;              // ？

    init() {
        this.musicVolumn = LocalStorage.getFloat(EnumLocalStorageKey.MUSIC_VOLUMN, 1);
        this.soundVolumn = LocalStorage.getFloat(EnumLocalStorageKey.SOUND_VOLUMN, 1);
        this.isVirate = LocalStorage.getBool(EnumLocalStorageKey.MUSIC_VIRATE);
    }

    setVirate(isVirate: boolean) {
        this.isVirate = isVirate;
        LocalStorage.setBool(EnumLocalStorageKey.MUSIC_VIRATE, isVirate);

        if (this.isVirate) {
            NativeBridge.vibrate();
        }
    }

    setSoundVolumn(value: number) {
        this.soundVolumn = value;
        LocalStorage.setInt(EnumLocalStorageKey.SOUND_VOLUMN, value);
        for (const iterator of this.playingSoundList) {
            cc.audioEngine.setVolume(iterator, value);
        }
    }

    setMusicVolumn(value: number) {
        this.musicVolumn = value;
        LocalStorage.setInt(EnumLocalStorageKey.MUSIC_VOLUMN, value);
        for (const iterator of this.playingMusicList) {
            cc.audioEngine.setVolume(iterator, value);
        }
    }

    /**
     * 播放音频
     * 如果同时播放相同的音频路径，会返回不同的音频ID
     */
    playSound(path: string, callback: Function = undefined) {
        if (path != "" && this.soundVolumn > 0) {
            Global.loaderMgr.loadRes(path, (error: Error, result: Object) => {
                if (error) {
                    Logger.error(`load sound failed ${error}`);
                    return;
                }
                let clip: cc.AudioClip = result as cc.AudioClip;
                let audioId: number = cc.audioEngine.play(clip, false, this.soundVolumn);
                var finish = () => {
                    let index = this._getSoundIdxById(audioId);
                    if (index != -1) {
                        this.playingSoundList.splice(index, 1);
                    }
                    if (callback != undefined) {
                        callback();
                    }
                };
                cc.audioEngine.setFinishCallback(audioId, finish.bind(this, audioId));
                this.playingSoundList.push({ audioId: audioId, path: path });
            })
        }
    }

    _onSoundPlayFinish(audioId: number) {
        let index = this._getSoundIdxById(audioId);
        if (index != -1) {
            this.playingSoundList.splice(index, 1);
        }
    }

    _getSoundIdxById(audioId: number) {
        for (var i = 0; i < this.playingSoundList.length; i++) {
            if (this.playingSoundList[i].audioId == audioId)
                return i;
        }
        return -1;
    }

    playMusic(path: string) {
        Global.loaderMgr.loadRes(path, (error: Error, result: Object) => {
            if (error) {
                Logger.error(`load music failed ${error}`);
                return;
            }
            let clip: cc.AudioClip = result as cc.AudioClip;
            let musicId: number = cc.audioEngine.play(clip, false, this.musicVolumn);
            this.playingMusicList.push(musicId);
        })
    }

    playBackgroundMusic(path: string) {
        this.stopBackgroundMusic();
        Global.loaderMgr.loadRes(path, (error: Error, result: Object) => {
            if (error) {
                Logger.error(`load back ground music failed ${error}`);
                return;
            }
            let clip: cc.AudioClip = result as cc.AudioClip;
            let musicId: number = cc.audioEngine.play(clip, true, this.musicVolumn);
            this.playingMusicList.push(musicId);
            this.playingBackgroundMusic = musicId;
        })
    }

    stopAllMusic() {
        for (const iterator of this.playingMusicList) {
            cc.audioEngine.stop(iterator);
        }
        this.playingMusicList = [];
    }

    stopSound(path: string) {
        let list = [];
        for (var i = 0; i < this.playingSoundList.length; i++) {
            if (this.playingSoundList[i].path == path) {
                list.push(i);
                cc.audioEngine.stop(this.playingSoundList[i].audioId);
            }
        }
        for (var iterator of list) {
            this.playingMusicList.splice(iterator, 1);
        }
    }

    stopAllSound() {
        for (const iterator of this.playingSoundList) {
            cc.audioEngine.stop(iterator.audioId);
        }
        this.playingSoundList = [];
    }

    stopBackgroundMusic() {
        if (this.playingBackgroundMusic != -1) {
            cc.audioEngine.stop(this.playingBackgroundMusic);
        }
        let index = this.playingMusicList.indexOf(this.playingBackgroundMusic)
        if (index != -1) {
            this.playingMusicList.splice(index, 1);
        }
        this.playingBackgroundMusic = -1;
    }

}