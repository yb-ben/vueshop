export  function find(arr,checker){
        
        let i = null;
        // for(i in arr){
        //     if(checker(arr[i])){
        //          return arr[i];
        //     }
        //     if(arr[i].children){
        //        return find(arr,checker);
        //     }
        // }
        let res = null;
        arr.forEach(value => {
            if(checker(value)){
                res = value;
                return false;
            }
            if(value.children){
                if(find(value.children,checker)){
                    return false;
                }
            }
        });
        return res;
    }


export function combine($arrs,str= '',pos = 0,){
    let len = $arrs.length;
    if(pos === len-1){
        return str;
    }
    
    return combine($arrs,str,pos++)
}
