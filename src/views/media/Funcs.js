import {ToastContainer,toast} from 'react-toastify'
export const checkType=(event)=>{
    let files=event.target.files;
    let err=""
    const types=['image/png','image/jpeg','image/jpg'];
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if(types.every(type=>element.type!==type))
        {
            err="لطفا یک فرمت تصویر اپلود کنید"
        }
    }
    if(err!==''){
        event.target.value=null
        toast.error(err)
        return false;
    }
    return true
}
export const maxSelectedFile=(event)=>{
    let files=event.target.files;
    let err="";
    if(files.length>3){
        event.target.value=null;
        err="شما نمیتوانید همزمان بیشتر از 3 تصویر اپلود کنید"
        toast.error(err);
        return false
    }
    return true
}

export const checkFileSize=(event)=>{
     
    let files=event.target.files;
    let err="";
    let size=3000
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if(element.size>size)
        {
            err+=element.size+"سایز تصویر بزرگ است"
        }
    }
    
    if(err!==''){
        event.target.value=null
        toast.error(err)
        return false;
    }
    return true
}