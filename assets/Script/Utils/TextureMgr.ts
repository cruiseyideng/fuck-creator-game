const {ccclass, property} = cc._decorator;

@ccclass
export default class TextureMgr extends cc.Component {

    @property({type:[cc.SpriteFrame]})
    public Spriteset: cc.SpriteFrame[] = [];

    @property({type:[cc.SpriteFrame]})
    public Spriteset1: cc.SpriteFrame[] = [];

    @property({type:[cc.SpriteFrame]})
    public Spriteset2: cc.SpriteFrame[] = [];

    @property({type:[cc.SpriteFrame]})
    public Spriteset3: cc.SpriteFrame[] = [];

    @property({type:[cc.SpriteFrame]})
    public Spriteset4: cc.SpriteFrame[] = [];
    
    onLoad() {
        // init logic
        
    }
}
