
export default class AmountUtils {
    /**
     * 玩家金额每3位加‘，’区分
     */
    static getAmount3t(amount: number) {
        return (amount || 0).toFixed(3).replace(/\d+/, (n) => {
            var len = n.length;
            if (len % 3 == 0) {
                return n.replace(/(\d{3})/g, ',$1').slice(1);
            } else {
                return n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ',$1');
            }
        });
    }
}
