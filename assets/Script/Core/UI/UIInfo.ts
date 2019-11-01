import { EnumLayer } from "../../Game/Enum/EnumLayer";

export default class UIInfo{
    name: string;       // ui名称
    uiClass: any;       // 类路径
    resPath: string;       // 资源路径
    zIndex: number;      // 深度
    layer: EnumLayer;      // 层级
    
}