
export default class ListHelper {

    static concat(arr, brr) {
        for (var i = 0; i < brr.length; i++) {
            arr.push(brr[i]);
        }
        return arr;
    }
}
