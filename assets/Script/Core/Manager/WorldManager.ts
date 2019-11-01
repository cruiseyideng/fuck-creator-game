import Global from "../../Game/Global";
import Logger from "../../Utils/Logger";
import StringUtil from "../../Utils/StringUtil";
import ClassUtil from "../Util/ClassUtil";
import LaunchWorld from "../../MyGame/World/LaunchWorld";
import World from "../World";
import WorldConst from "../../Game/Const/WorldConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorldManager {

    private worldNameClass: Object = {};

    init() {
    }

    // TODO: 函数名小写打头
    /** 游戏场景切换带场景切换 */
    switchWorld(name: string, callback: Function = null) {
        if (null == Global.world || name == Global.world.name) {
            Logger.warn(StringUtil.format("change world from/to name are same! {0}", name));
        }
        if (Global.world) {
            Global.world.onDestroy();
        }
        let newWorld: World = this.getWorldObj(name);
        if (newWorld == undefined) {
            Logger.error("create world failed!!", name);
        }

        Global.loaderMgr.sceneSwitch(name, newWorld.preloadAssets, () => {
            Logger.log("switchWorld: ", name);
            Global.world = newWorld;
            Global.world.init();

            if (null != callback) {
                callback();
            }
        })
    }

    /** 
     * 游戏场景切换不带场景切换
     * */
    changeWorld(name: string) {
        if (Global.world != undefined) {
            Global.world.onDestroy();
            Global.world = undefined;
        }

        let newWorld = this.getWorldObj(name);
        if (!newWorld) {
            Logger.error("create world failed!!", name);
            return;
        }
        
        Global.loaderMgr.sceneSwitch(undefined, newWorld.preloadAssets, () => {
            Logger.log("changeWorld: ", name);
            Global.world = newWorld;
            Global.world.init();
        });
    }

    getWorldObj(name: string) {
        if (this.worldNameClass.hasOwnProperty(name)) {
            return ClassUtil.instantiate(this.worldNameClass[name]);
        }
        return undefined;
    }

    register(name: string, worldClass: any) {
        if (this.worldNameClass.hasOwnProperty(name)) {
            Logger.error("world class already exists!", name);
            return;
        }
        this.worldNameClass[name] = worldClass;
    }

    unregister(name: string) {
        if (this.worldNameClass.hasOwnProperty(name)) {
            delete this.worldNameClass[name];
        }
    }

}
