export function getGroupIndex(groupList: any, groupId: number): number {
    let idList: number[] = [];
    for (let item of groupList) {
        idList.push(item.getRoomid());
    }
    return idList.indexOf(groupId);
}

export function toPrecisionIgnoreEnd(value: number): number {
    return Math.floor(value * 10000) / 10000;
}

export function convertHex2PokerData(hexValue: number): [number, number] {
    const data = new Uint8Array([(hexValue & 0xff) >> 4,(hexValue & 0x0f)]);
    const index = (data[1] + 1) % 13;
    
    return [data[0], index == 0 ? 13 : index];
}

export function convertHex2PokerData2(hexValue: number): [number, number] {
    const data = new Uint8Array([(hexValue & 0xff) >> 4,(hexValue & 0x0f)]);
    
    return [data[0], data[1]];
}

export function convertHex2PokerData3(hexValue: number): [number, number] {
    const data = new Uint8Array([(hexValue & 0xff) >> 4,(hexValue & 0x0f)]);
    const index = (data[1]) % 13;
    
    return [data[0], index == 0 ? 13 : index];
}

export function adjust2ValidateFaceId(faceId: number): number {
    return faceId > 5 ? Math.floor(Math.random() * 6) : faceId; 
}

function convert2Small(num: number, coinList: number[], digitalList: number[]) {
    // const digitalList = [1, 5, 10, 50, 100, 500];
    let tempNum = num;

    for(let i = digitalList.length - 1; i >= 0; i--) {
        const digital = digitalList[i];
        while(tempNum >= digital) {
            coinList.push(digital);
            tempNum -= digital;
        }
        if(tempNum == 0) {
            return;
        }
    }
}

function replaceBig2Small(coinList: number[]) {
    for(let i = coinList.length - 1; i >= 0; i--) {
        const digital = coinList[i];
        if(digital == 50) {
            coinList.splice(i, 1, 10, 10, 10, 10, 10);
            return;
        }
        else if(digital == 100) {
            coinList.splice(i, 1, 50, 10, 10, 10, 10, 10);
            return;
        }
    }
}

function replaceOneOf10to5(coinList: number[]) {
    for(let i = 0; i < coinList.length; i++) {
        if(coinList[i] == 5) {
            return;
        }
    }
    for(let i = coinList.length - 1; i >= 0; i--) {
        if(coinList[i] == 10) {
            coinList.splice(i, 1, 5, 5);

            return;
        }
    }
}

function usortCoinList(coinList: number[]) {
    const size = coinList.length;
    const randomList = [9, 8, 7, 5, 0, 2, 1, 4, 3, 6];
    const l = size < randomList.length ? size : randomList.length;

    for(let i = 0; i < l; i++) {
        const index = randomList[i];

        if(size > index) {
            const temp = coinList[index];
            coinList[index] = coinList[i];
            coinList[i] = temp;
        }
    }
}

function convertBigCoin2SmallCoins(num: number, digitalList: number[], hasFive: boolean): number[] {
    if(num == 100) {
        return [100];
    }
    else if(num == 500) {
        return [500];
    }
    
    let coinList: number[] = [];
    convert2Small(num, coinList, digitalList);

    if(coinList.length < 9) {
        replaceBig2Small(coinList);
    }
    if(hasFive) {
        replaceOneOf10to5(coinList);
    }
    usortCoinList(coinList);

    return coinList;
}

export function convertBigCoin2SmallCoins1(num: number): number[] {
    let chipValueList = [1, 5, 10, 50, 100, 500];
    if (chipValueList.indexOf(num) != -1) {
        return [num];
    }
    return convertBigCoin2SmallCoins(num, chipValueList, true);
}

export function convertBigCoin2SmallCoins2(num: number): number[] {
    let chipValueList = [1, 10, 50, 100, 500];
    if (chipValueList.indexOf(num) != -1){
        return [num];
    }
    return convertBigCoin2SmallCoins(num, chipValueList, false);
}

export function local2ServerPayType(type: number, payType: number) {
    if(type == 2) {
        return payType + 11;
    }
    else {
        return type;
    }
}

export function server2LocalPayType(type: number) {
    return type - 11;
}

export function server2LocalPayTypeGroup(type: number) {
    if(type > 10) {
        return [2, server2LocalPayType(type)];
    }
    else {
        return [type, 0];
    }
}

export function getBaseName(path: string): string {
    return path.split('/').pop();
}