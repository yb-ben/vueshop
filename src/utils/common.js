export  function find(arr,checker){

        let res = null;
        let len = arr.length;
        for(let i = 0;i<len;i++){
            if(checker(arr[i])){
                res = arr[i];
                break;
            }
            if(arr[i].children){
                res = find(arr[i].children,checker);
                if(res){
                    break;
                }
            }
        }
        return res;
    }


export function combine($arrs,str= '',pos = 0,){
    let len = $arrs.length;
    if(pos === len-1){
        return str;
    }
    
    return combine($arrs,str,pos++)
}


export function foo($arr,$currHeight,$height,$obj,$attr, $save,$key,$cacheMap){
    let t =  $arr[$currHeight];
    let c = $currHeight +1;
    for(let i = 0;i<t.length;i++){
        if(!$currHeight){
            $obj = {};
            $key = '';
        }
        $obj['k'+c] = $attr[$currHeight].k;
        $obj['k'+c+'_id'] = $attr[$currHeight].k_id; 
        $obj['v'+c] = t[i].v;     
        $obj['v'+c+'_id'] = t[i].v_id;
        
        //$key += 'k'+$attr[$currHeight].k_id + 'v'+t[i].v_id;

        if(c < $height){
            foo($arr,$currHeight+1,$height,$obj,$attr,$save,$key,$cacheMap);
        }else{
            let m ;
            if($cacheMap.has($key)){
                m = $cacheMap.get($key);
                $obj.cast = m.cast;
                $obj.weight = m.weight;
                $obj.price = m.price;
                $obj.code = m.code;
                $cacheMap.delete($key);
            }
            let $new = Object.assign({},$obj);
            $save.push($new);
            $cacheMap.set($key,$new);
        }
    }
}
