import Logger from "../Utils/Logger";
import ClassUtil from "./Util/ClassUtil";
import { EnumPart } from "../Game/Enum/EnumPart";

/**
 * 部件工厂
 */

export default class PartFactory {

    partDict: { [partNo: number]: any; } = {};      // 零件字典

    /**
     * 反注册部件类型
     * @param partNo 部件编号
     */
    unregisterPart(partNo: number) {
        if (this.partDict[partNo]) {
            delete this.partDict[partNo];
        }
    }

    /**
     * 注册部件类型
     * @param partNo 部件编号
     * @param partClass 部件类
     */
    registerPart(partNo: number, partClass: any) {
        if (this.partDict[partNo]) {
            Logger.error("part already exists!", partNo);
            return;
        }
        this.partDict[partNo] = partClass;
    }

    /**
     * 实例化部件
     * @param partNo 部件编号
     */
    instantiatePart(partNo: number) {
        let partClass = this.partDict[partNo];
        let obj;
        if (partClass) {
            obj = ClassUtil.instantiate(partClass);
        }
        return obj;
    }

}