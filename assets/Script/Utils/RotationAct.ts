
export default class RotationAct {
    target: cc.Node;
    delaySec: number;
    callFunc: Function;

    SetRotationX(node: cc.Node, delaySec:number, callback: Function) {
        this.callFunc = callback;
        this.target = node;
        this.delaySec = delaySec;
        var finished = cc.callFunc(this.rotationXOver, this);
        this.target.setScale(cc.v2(1, 1));
        var seq = cc.sequence(cc.scaleTo(this.delaySec / 2, 0, 1), finished);
        node.runAction(seq);

    }

    rotationXOver(bind) {
        if (this.callFunc != null) {
            this.callFunc(false);
        }
        let seq = cc.sequence(cc.scaleTo(this.delaySec / 2, 1, 1), cc.callFunc(()=>{
            if (this.callFunc){
                this.callFunc(true);
            }
        }));
        this.target.runAction(seq);
    }

    SetRotationY(node: cc.Node, delaySec:number, callback: Function) {
        this.callFunc = callback;
        this.target = node;
        this.delaySec = delaySec;
        var finished = cc.callFunc(this.rotationYOver, this);
        this.target.setScale(cc.v2(1, 1));
        var seq = cc.sequence(cc.scaleTo(this.delaySec / 2, 1, 0), finished);
        node.runAction(seq);

    }

    rotationYOver(bind) {
        if (this.callFunc != null) {
            this.callFunc(false);
        }
        let seq = cc.sequence(cc.scaleTo(this.delaySec / 2, 1, 1), cc.callFunc(()=>{
            if (this.callFunc){
                this.callFunc(true);
            }
        }));
        this.target.runAction(seq);
    }

}
