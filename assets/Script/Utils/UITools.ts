
export default class UITools {

    /**根据路径查找子节点 */
    static FindChild(root: cc.Node, path: string) {
        if (null != root) {
            return cc.find(path, root);
        }
        return null;
    }

    /**是否为空 */
    static IsNal(target: any) {
        if (target == null || target == undefined) {
            return true;
        }
        return false;
    }
}
