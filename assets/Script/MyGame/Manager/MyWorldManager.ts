import WorldManager from "../../Core/Manager/WorldManager";
import LaunchWorld from "../World/LaunchWorld";
import WorldConst from "../../Game/Const/WorldConst";

export default class MyWorldManager extends WorldManager{

    init(){
        super.init();
        
        this.register(WorldConst.Launch, LaunchWorld);
    }

}