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
