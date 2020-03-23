import request from '@/utils/request'

export function find(arr, checker) {

    let res = null;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        if (checker(arr[i])) {
            res = arr[i];
            break;
        }
        if (arr[i].children) {
            res = find(arr[i].children, checker);
            if (res) {
                break;
            }
        }
    }
    return res;
}


export function combine($arrs, str = '', pos = 0, ) {
    let len = $arrs.length;
    if (pos === len - 1) {
        return str;
    }

    return combine($arrs, str, pos++)
}

//获取网络图片
export function getNetworkImage(url) {
    return request({
        url
    })
}

