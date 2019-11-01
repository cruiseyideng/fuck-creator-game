export default class MathEX {
    // 很小的小数，用于比较两个浮点数是否相当
    public static FLOAT_EPSILON: number = 0.000001;

    public static distance(p1: cc.Vec2, p2: cc.Vec2) {
        return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
    }

    public static sub(p1: cc.Vec2, p2: cc.Vec2) {
        return cc.v2(p1.x - p2.x, p1.y - p2.y);
    }

    public static add(p1: cc.Vec2, p2: cc.Vec2) {
        return cc.v2(p1.x + p2.x, p1.y + p2.y);
    }

    public static mult(p: cc.Vec2, s: number) {
        return cc.v2(p.x * s, p.y * s);
    }

    public static dot(v1: cc.Vec2, v2: cc.Vec2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    public static normalize(v: cc.Vec2) {
        return this.mult(v, 1 / (Math.sqrt(this.dot(v, v))));
    }

    public static toAngle(v: cc.Vec2) {
        return Math.atan2(v.y, v.x);
    }

    public static forAngle(radians: number) {
        return cc.v2(Math.cos(radians), Math.sin(radians));
    }

    public static radiansToDegrees(radians: number) {
        return cc.macro.DEG * radians;
    }

    public static degreesToRadians(degrees: number) {
        return cc.macro.RAD * degrees;
    }

    public static calIntersectionPointOfTwonLine(line1_p1: cc.Vec2, line1_p2: cc.Vec2, line2_p1: cc.Vec2, line2_p2: cc.Vec2) {
        let k1 = Math.tan(this.toAngle(this.sub(line1_p2, line1_p1)));
        let b1 = line1_p1.y - k1 * line1_p1.x;
        let k2 = Math.tan(this.toAngle(this.sub(line2_p2, line2_p1)));
        let b2 = line2_p1.y - k2 * line2_p1.x;

        if (Math.abs(k1 - k2) <= 0.0000001) {
            throw new Error("两线平行不相交");
        }

        let y = (b2 - k2 * b1 / k1) / (1 - k2 / k1);
        let x = (y - b1) / k1;
        return cc.v2(x, y);
    }

    public static calCenterOfGravityPoint(points: cc.Vec2[]) {
        let area = 0;
        let g_x = 0, g_y = 0;
        for (let i = 1; i <= points.length; i++) {
            let point1 = points[i % points.length];
            let point2 = points[i - 1];
            let tempArea = (point1.x * point2.y - point1.y * point2.x) / 2;
            area += tempArea;
            g_x += tempArea * (point1.x + point2.x) / 3;
            g_y += tempArea * (point1.y + point2.y) / 3;
        }
        g_x /= area;
        g_y /= area;
        return cc.v2(g_x, g_y);
    }

    public static randomFloatA2B(numA: number, numB: number): number {
        return Math.random() * (numB - numA) + numA;
    }

    public static randomIntA2B(numA: number, numB: number, includeA: boolean = false, includeB: boolean = false): number {
        let rn = 0;
        if (includeA && !includeB) {//A <= Random && Random < B
            rn = Math.floor(Math.random() * (numB - numA)) + numA;
        }
        else if (includeA && includeB) {//A <= Random && Random <= B
            rn = Math.floor(Math.random() * (numB - numA + 1)) + numA;
        }
        else if (!includeA && includeB) {//A < Random && Random <= B
            rn = Math.ceil(Math.random() * (numB - numA)) + numA;
        }
        else {//A < Random && Random < B
            rn = Math.ceil(Math.random() * (numB - numA - 1)) + numA;
        }
        return rn;
    }

    /**从一个数组中通过概率获随机获取某个元素 */
    public static randomElementInArray(stuffs: any[], rates: number[]): any {
        if (stuffs.length != rates.length) {
            throw new Error("概率个数应该和数组元素个数相同");
        }
        let totalRate = 0;
        let f = 100000;
        rates.forEach(element => {
            totalRate += element * f;
        });
        if (totalRate != 1 * f) {
            throw new Error("概率之和必须等于1");
        }

        let sliceLimits: { upLimit: number, downLimit: number }[] = [];
        let up = 0;
        let down = 0;
        for (let i = 0; i < stuffs.length; i++) {
            up = rates[i] * f + down;
            sliceLimits.push({ upLimit: up, downLimit: down });
            down += rates[i] * f;
        }

        let rn = MathEX.randomIntA2B(0, f, true, true);
        for (let i = 0; i < sliceLimits.length; i++) {
            let sliceLimit = sliceLimits[i];
            if (sliceLimit.downLimit <= rn && rn < sliceLimit.upLimit) {
                return stuffs[i];
            }
        }
        return stuffs[0];
    }

    /**随机获取一个数组里的元素 */
    public static randomElement(stuffs: any[]) {
        let randomNum = Math.floor(stuffs.length * Math.random());
        return stuffs[randomNum];
    }

    /**通过概率获随机获取0至n之间的数(包含0，不包含n) */
    public static randomIntFromRate(n: number, rates: number[]): number {
        if (n != rates.length) {
            throw new Error("概率个数应该和n相同");
        }
        let totalRate = 0;
        let f = 100000;
        rates.forEach(element => {
            totalRate += element * f;
        });
        if (totalRate != 1 * f) {
            throw new Error("概率之和必须等于1");
        }

        let sliceLimits: { upLimit: number, downLimit: number }[] = [];
        let up = 0;
        let down = 0;
        for (let i = 0; i < n; i++) {
            up = rates[i] * f + down;
            sliceLimits.push({ upLimit: up, downLimit: down });
            down += rates[i] * f;
        }

        let rn = MathEX.randomIntA2B(0, f, true, true);
        for (let i = 0; i < sliceLimits.length; i++) {
            let sliceLimit = sliceLimits[i];
            if (sliceLimit.downLimit <= rn && rn < sliceLimit.upLimit) {
                return i;
            }
        }
        return 0;
    }

    /**整数用零补齐位数 */
    public static fillZero(num: number, n: number): string {
        let len = num.toString().length;
        let numStr = num.toString();
        while (len < n) {
            numStr = "0" + numStr;
            len++;
        }
        return numStr
    }
    
    public static compareFloat(value1:number, value2:number){
        let tempValue:number = value1-value2;
        if (Math.abs(tempValue) < this.FLOAT_EPSILON){ //2个相等
            return 0;
        } else if (tempValue < 0){ //value1比较小
            return 1;
        }else{ //value1比较大
            return -1;
        }
    }

    public static isBigger(value1: number, value2: number) {
        if (this.compareFloat(value1, value2) == -1) {
            return true;
        }
        return false;
    }
}
