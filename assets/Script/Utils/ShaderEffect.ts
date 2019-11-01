
const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderEffect extends cc.Component {

    @property({})
    default_vert:string = "ccShader_Default_Vert";

    @property({})
    default_vert_no_mvp:string ="ccShader_Default_Vert_noMVP";

    @property({})
    black_white_frag:string = "ccShader_Avg_Black_White_Frag";

    private _program;
    private glNode;

    private startTime;
    private time;
    private resolutionX;
    private resolutionY;
    private Year;
    private Month;
    private Day;
    private Nowtime;

    private glassFactor =0;
    private resolution;
    private mouse;
    private data;

    onLoad() {
        // init logic

        // 取到ccsg.Node对象，这里我使用在精灵上，所以节点上必须挂载“cc.Sprite”组件
        this.loadShaderCode();
        
        this.startTime = cc.sys.now();
    }

    start(){
        this.resolution = {x:0.0,y:0.0,z:1.0};
        this.data = {x:0.0,y:0.0,z:1.0,w:1.0};
    }

    loadShaderCode () {
        
        if (cc.sys.isNative) {
                this.default_vert_no_mvp = require(this.default_vert_no_mvp);
        } else {
                this.default_vert = require(this.default_vert);
        }
        this.black_white_frag = require(this.black_white_frag);
    }

    setFrag(frag){
        this.black_white_frag = frag;
    }

    effect(effectType:string){

        this.glNode = this.getComponent('cc.Sprite')._sgNode;
        this.onInitGLProgram(effectType);
    }

   

    onInitGLProgram (effectType:string) {

        var shader = model.getInstance().getValue("shader_"+effectType)
        if( !shader){
            this._program = new cc.GLProgram();
        
            if (cc.sys.isNative) {
                this._program.initWithString(this.default_vert_no_mvp, this.black_white_frag);

                //fire
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

                this._program.link();
                this._program.updateUniforms();

                //fire
                this.updateGLParameters();
            } else {
                this._program.initWithVertexShaderByteArray(this.default_vert, this.black_white_frag);
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
                this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

                this._program.link();
                this._program.updateUniforms();
               
                //fire
                this._program.use();
                this.updateGLParameters();

                //fire
                this._program.setUniformLocationWith3f( this._program.getUniformLocationForName('iResolution'), this.resolutionX,this.resolutionY,1.0 );
                this._program.setUniformLocationWith1f( this._program.getUniformLocationForName('iGlobalTime'), this.time );
                //以下二個參數似乎沒用
                this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iMouse'),11,12,13,14);
                this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iDate'), 11,12,13,14);
            }
        }
        else this._program = shader;
        //靜態設定值
        if( effectType == "blur"){
            this.fixSetting();
            model.getInstance().pushValue("shader_"+effectType,this._program);
        }
        
        // //fire
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec3( "iResolution", cc.v2(100,100) );
            glProgram_state.setUniformFloat( "iGlobalTime" , this.time );
            glProgram_state.setUniformVec4( "iMouse" , 10 );
        }else{

            this.resolution = this._program.getUniformLocationForName('iResolution');
            var time = this._program.getUniformLocationForName( "iGlobalTime" );
            var data = 
            this.mouse = this._program.getUniformLocationForName( "iMouse" );

            this._program.setUniformLocationWith3f( this.resolution, this.resolutionX,this.resolutionY,1.0 );
            this._program.setUniformLocationWith1f( time, this.time );
            //this._program.setUniformLocationWith4f( this.mouse, 10,10 ,10,10);
            //this._program.setUniformLocationWith4f( data, this.Year,this.Month,this.Day,this.time );
        }

        this.setProgram(this.glNode, this._program);
    }

    update(dt){
        if(this.glassFactor>=40){
            this.glassFactor=0;
        }
        this.glassFactor+=dt*3;

        if(this._program){

            this._program.use();
            this.updateGLParameters();
            if(cc.sys.isNative){
                // var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                // glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
                // glProgram_state.setUniformFloat( "iGlobalTime", this.parameters.time );    
                // glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
                // glProgram_state.setUniformVec4( "iDate" , this.parameters.date );
            }else{
                //var _resolution = cc.v3(100,100);
                var time = this._program.getUniformLocationForName( "iGlobalTime" );
                var data;
                this._program.setUniformLocationWith3f( this.resolution, this.resolutionX,this.resolutionY,1.0 );
                this._program.setUniformLocationWith1f( time, this.time );
                //this._program.setUniformLocationWith4f( 10, 10,10 ,10,10);
                //this._program.setUniformLocationWith4f( data, this.Year,this.Month,this.Day,this.time );
            }
        }
    }

    /**
     * blur setting
     */
    fixSetting(){
        var _uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
        var _uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
        var _uniStrength = this._program.getUniformLocationForName( "strength" );
        
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( _uniWidthStep , ( 1.0 / this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( _uniHeightStep , ( 1.0 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat(  _uniStrength, 1.0 );
        }else{
            this._program.setUniformLocationWith1f( _uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( _uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
            
            /* 模糊 0.5     */
            /* 模糊 1.0     */
            /* 细节 -2.0    */
            /* 细节 -5.0    */
            /* 细节 -10.0   */
            /* 边缘 2.0     */
            /* 边缘 5.0     */
            /* 边缘 10.0    */
            this._program.setUniformLocationWith1f( _uniStrength, 1.0 );
        }
    }

    updateGLParameters(){
        var testDate = new Date();
        this.time  =  (cc.sys.now() - this.startTime) /1000;
        this.resolutionX = this.node.getContentSize().width;
        this.resolutionY = this.node.getContentSize().height
        this.Year  = testDate.getFullYear();
        this.Month = testDate.getMonth();
        this.Day = testDate.getDay();
        this.Nowtime = testDate.getTime();

       // this.data = 
    }

    setProgram (sgNode, glProgram) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
            sgNode.setGLProgramState(glProgram_state);
        } else {
            sgNode.setShaderProgram(glProgram);    
        }

        var children = sgNode.children;
        if (!children) {
            return;
        }

        for (var i = 0; i < children.length; i++) {
            this.setProgram(children[i], glProgram);
        }
    }
        
}
