/**
 * 类操作
 */

export default class ClassUtil{
     
    static instantiate(classObj: any, ...params){
        let obj = Object.create(classObj.prototype);
        obj.constructor.apply(obj, params);
        return obj;
    }

}