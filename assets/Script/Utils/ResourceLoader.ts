import Logger from "./Logger";
import EventManager from "../Core/Manager/EventManager";
import CommonEvent from "../Game/Event/CommonEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResourceLoader {

    public static instance: ResourceLoader = new ResourceLoader();
    private assetArray = [
        "atlas/Poker",
        "atlas/bullaltas",
        "atlas/pokerColor",
        "atlas/pokerNum",
        "atlas/level",
        "atlas/RedBlackTp",
        "Common/Atlas/Common",
        "Common/Atlas/Popup",
        "Common/Atlas/Head",
        "Common/Atlas/TrendMap"
    ];

    private fontArrary: Array<string> = [
        "font/winloseNumwin",
        "font/winloseNumlose",
        "Common/Font/font_winNum",
        "Common/Font/font_loseNum"
    ];

    private totalNum: number;
    private curNum: number;
    private msg: string = "";
    private isPreloaded: boolean = false;

    //一些常用图集
    public commonAtlas: cc.SpriteAtlas = null;
    public popupAtlas: cc.SpriteAtlas = null;
    public headAtlas: cc.SpriteAtlas = null;
    public trendMapAtlas: cc.SpriteAtlas = null;

    public preLoad(callback: Function) {
        if (this.isPreloaded) {
            callback();
            return;
        }
        this.isPreloaded = true;
        Logger.log("ResourceLoader preload");
        this.preloadMusic((musicList) => {
            Logger.log("ResourceLoader start music");
            this.curNum = 0;
            MusicManagwer.instance.musicJsonList = musicList;
            this.totalNum = musicList.length;
            this.msg = "正在加载资源，此过程不消耗流量..."
            this.loadMusic(musicList, () => {
                cc.director.preloadScene('Lobby', function () {
                });
                Logger.log("ResourceLoader end music");
                this.curNum = 0;
                this.totalNum = this.assetArray.length;
                this.msg = "正在加载资源，此过程不消耗流量...";
                DropCoinPrefab.preLoad(() => {
                    SelectCoinPrefab.preLoad(() => {
                        HeadPrefab.preLoad(() => {
                            GamePlayerShowPrefab.preLoad();
                            this.preloadResAtlas(() => {
                                Logger.log("ResourceLoader end atlas");
                                this.curNum = 0;
                                this.totalNum = this.fontArrary.length;
                                this.preloadFont(() => {
                                    Logger.log("ResourceLoader end font");
                                    this.preloadBank(callback);
                                });
                            });
                        });
                    });
                });
            });
        });

    }

    private preloadMusic(callback: Function) {
        //讀取音樂
        cc.loader.loadRes("Config/music", function (err, jsonob) {
            if (err) {
                // Global.gUIMgr.showPopTip("music Load error");
            }
            if (EngineHelper.isNewEngine()) {
                callback(jsonob["json"]["sound"]);
            } else {
                callback(jsonob["sound"]);
            }
        });
    }

    private loadMusic(musicList, callback: Function) {
        MusicManagwer.instance.LoadMusicList(musicList, (() => {
            this.curNum += 1;
            EventManager.instance.dispatchEvent(CommonEvent.Event_ResourceLoader, this.curNum, this.totalNum, this.msg);
            if (this.curNum >= this.totalNum) {
                callback();
            }
        }));
    }

    private preloadResAtlas(callback: Function) {
        if (this.curNum < this.assetArray.length) {
            // let resPath:string = this.assetArray.shift();
            let resPath: string = this.assetArray[this.curNum];
            this.curNum += 1;
            EventManager.instance.dispatchEvent(CommonEvent.Event_ResourceLoader, this.curNum, this.totalNum, this.msg);
            cc.loader.loadRes(resPath, cc.SpriteAtlas, (err, atlas) => {
                if (resPath == 'Common/Atlas/Common') {
                    this.commonAtlas = atlas;
                }
                else if (resPath == 'Common/Atlas/Popup') {
                    this.popupAtlas = atlas;
                }
                else if (resPath == 'Common/Atlas/Head') {
                    this.headAtlas = atlas;
                }
                else if (resPath == 'Common/Atlas/TrendMap') {
                    this.trendMapAtlas = atlas;
                }
                this.preloadResAtlas(callback);
            });
        }
        else {
            callback();
        }
    }

    private preloadFont(callback: Function) {
        if (this.curNum < this.fontArrary.length) {
            // let resPath: string = this.fontArrary.shift();
            let resPath: string = this.fontArrary[this.curNum];
            this.curNum += 1;
            EventManager.instance.dispatchEvent(CommonEvent.Event_ResourceLoader, this.curNum, this.totalNum, this.msg);
            cc.loader.loadRes(resPath, cc.Font, (err, atlas) => {
                this.preloadFont(callback);
            });
        }
        else {
            callback();
        }
    }

    private preloadBank(callback: Function) {
        callback();
        // cc.loader.loadRes("Aconfig/yinhang", (err, jsonob) => {
        //     Logger.log("ResourceLoader end yinhang");
        //     if (EngineHelper.isNewEngine()) {
        //         BankModel.bankJson = jsonob["json"];
        //     } else {
        //         BankModel.bankJson = jsonob;
        //     }
        //     BankModel.init();
        //     this.isPreloaded = false;
        //     callback();
        // });
    }

}
