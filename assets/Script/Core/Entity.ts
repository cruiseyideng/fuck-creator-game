import Part from "./Part";
import Global from "../Game/Global";
import Logger from "../Utils/Logger";
import EventManager from "./Manager/EventManager";
import { EnumPart } from "../Game/Enum/EnumPart";

/**
 * 实体
 * feature：
 * 1. 父类的init完成后，再调用基类的init
 */

export default class Entity {

    partList: Part[] = [];                         // 零件列表
    partDict: { [partNo: number]: Part; } = {};     // 零件字典

    private _id: number = 0;
    private _inited: boolean = false;
    private _postInited: boolean = false;
    private _started: boolean = false;
    private _destroyed: boolean = false;

    constructor(id) {
        this._id = id;
    }

    // 注意：父类的init完成后，再调用基类的init
    init() {
        for (const part of this.partList) {
            if (!part.isInit()) {
                part.init();
            }
        }
        this._inited = true;
    }

    initFromDict(data) {
        for (const part of this.partList) {
            if (part.initFromDict) {
                part.initFromDict(data);
            }
        }
    }

    postInit() {
        for (const part of this.partList) {
            if (!part.isPostInit()) {
                part.postInit();
            }
        }
        this._postInited = true;
    }

    start() {
        for (const part of this.partList) {
            if (!part.isStart()) {
                part.start();
            }
        }
        this._started = true;
    }

    onDestroy() {
        for (const part of this.partList) {
            if (!part.isDestroyed()) {
                part.onDestroy();
            }
        }
        this._destroyed = true;
    }

    /**
     * 添加部件
     * @param partNo 部件编号
     */
    addPart(partNo: number) {
        let part: Part = this.partDict[partNo];
        if (part) {
            Logger.error("fetal:add part failed!! part already exists!!", EnumPart[partNo]);
            return;
        }
        part = Global.partFactory.instantiatePart(partNo);
        if (!part) {
            Logger.error("fetal:create part failed!! part is not registered in part manager", EnumPart[partNo]);
            return;
        }
        part.entity = this;
        this.partDict[partNo] = part;
        this.partList.push(part);
        if (this._inited) {
            part.init();
        }
        if (this._postInited) {
            part.postInit();
        }
        if (this._started) {
            part.start();
        }
    }

    /**
     * 获取部件
     * @param T 部件类型
     * @returns 部件类型为T的对象或者undefined
     */
    getPart<T extends Part>(partNo: number): T {
        return this.partDict[partNo] as T;
    }

    hasPart(partNo: number): boolean {
        return this.partDict[partNo] != undefined;
    }

    public get id(): number {
        return this._id
    }

}