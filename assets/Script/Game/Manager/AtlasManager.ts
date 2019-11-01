import Global from "../Global";
import UITools from "../../Utils/UITools";
import { EnumAtlas } from "../Enum/EnumAtlas";

export default class AtlasManager {
    // TODO: 需要重构成Const
    static COMMON_LIST = [
        
    ];

    atlasDict: { [name: string]: cc.SpriteAtlas; } = {};
    waitList = [];
    loadingList = [];


    init() {
        AtlasManager.COMMON_LIST.forEach(path => {
            Global.loaderMgr.loadAtlas(path, (error, atlas) => {
                this.atlasDict[path] = atlas;
                this.setDefaultSprite(path);
            });
        });
    }

    /**加载后赋值 */
    setDefaultSprite(atlasEnum) {
        for (const key in this.waitList) {
            let list = this.waitList[key];
            if (atlasEnum == key && !UITools.IsNal(list)) {
                list.forEach(info => {
                    if (!UITools.IsNal(info.sprite)) {
                        info.sprite.spriteFrame = this.atlasDict[info.atlasName].getSpriteFrame(info.name);
                    }
                });
            }
        }
        this.waitList[atlasEnum] = null;
    }

    /**
     * 设置SpriteFrame
     */
    setSpritFrame(atlasEnum: EnumAtlas, name: string, sprite: cc.Sprite) {
        let atlas = this.atlasDict[atlasEnum];
        if (UITools.IsNal(atlas)) {
            let obj = { atlasName: atlasEnum, name: name, sprite: sprite };
            if (AtlasManager.COMMON_LIST.indexOf(atlasEnum) == -1 && this.loadingList[atlasEnum] != true) {
                this.loadingList[atlasEnum] = true;
                Global.loaderMgr.loadAtlas(atlasEnum, (error, atlas) => {
                    this.atlasDict[atlasEnum] = atlas;
                    this.loadingList[atlasEnum] = false;
                    this.setDefaultSprite(atlasEnum)
                });
            }
            if (UITools.IsNal(this.waitList[atlasEnum])) {
                this.waitList[atlasEnum] = [];
            }
            this.waitList[atlasEnum].push(obj);
            return;
        }
        if (!UITools.IsNal(sprite)) {
            sprite.spriteFrame = atlas.getSpriteFrame(name);
        }
    }

    getAtlas(name: string) {
        return this.atlasDict[name];
    }

    release() {
        for (const key in this.atlasDict) {
            if (!this.inCommonList(key)) {
                this.atlasDict[key] = undefined;
            }
        }
    }

    inCommonList(name) {
        let result: boolean = false;
        AtlasManager.COMMON_LIST.forEach(element => {
            if (element == name) {
                result = true;
            }
        });
        return result;
    }

    onDestroy() {
        // TODO: 未清除内存？
        this.waitList = undefined;
        this.atlasDict = undefined;
        this.loadingList = undefined;
    }

}
