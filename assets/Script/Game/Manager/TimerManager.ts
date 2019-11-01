import UITools from "../../Utils/UITools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerManager extends cc._BaseNode {
    serverTime: number;     //当前服务器时间
    timer: cc.Scheduler;
    scheduleMap: Map<string, any> = new Map();

    init() {
        this.timer = cc.director.getScheduler();
        this.setScheduleUpdate(this);
    }

    update(dt) {
        this.serverTime += dt;
        let removeList = [];
        this.scheduleMap.forEach((v, key) => {
            let obj = v;
            if (!UITools.IsNal(obj)) {
                obj.curtime += dt;
                if ((obj.count == 0 && obj.curtime >= obj.delay + obj.interval) || obj.curtime >= obj.interval) {
                    obj.count += 1;
                    obj.curtime = 0;
                    if (!UITools.IsNal(obj.func)) {
                        obj.func(obj.param);
                    }
                    if (obj.repeat > 0 && obj.count >= obj.repeat) {
                        removeList.push(key);
                    }
                }
            }
        });
        removeList.forEach(key => {
            this.scheduleMap.delete(key);
        });
    }

    /**
     * 获取当前服务器时间
     */
    getServerTime() {
        return this.serverTime;
    }

    /**
     * 设置定时器
     * @param func 回调
     * @param target 作用域
     * @param interval 时长
     * @param repeat 重复次数 <=0则无限次数
     */
    setSchedule(name: string, func: Function, interval: number, repeat: number = 0, delay: number = 0, paused: boolean = false) {
        let obj = this.scheduleMap.get(name);
        if (!UITools.IsNal(obj)) {
        } else {
            obj = { name: name, func: func, interval: interval, repeat: repeat, delay: delay, paused: paused, curtime: 0, count: 0 };
            this.scheduleMap.set(name, obj);
        }
    }

    /**
     * 取消定时器
     * @param func 
     * @param target 
     */
    unSchedule(name: string) {
        this.scheduleMap.delete(name);
    }

    /**
     * update 定时器每一帧都会被触发，并且触发的函数是target上的update函数。优先级的值越低，定时器被触发的越早。
     * @param target 
     */
    setScheduleUpdate(target: any, priority: number = 0, paused: boolean = false) {
        this.timer.scheduleUpdate(target, priority, paused, undefined);
    }

    /**
    * 取消指定对象的 update 定时器。
    * @param target 
    */
    unscheduleUpdate(target: any) {
        this.timer.unscheduleUpdate(target);
    }
}
