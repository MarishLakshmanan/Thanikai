import Compressor from "compressorjs";

function storeImage(e,setImages){
    var image;
    const file = e.target.files[0];
    if(!file) return false;

    new Compressor(file,{
        quality:0.6,
        success:(res)=>{
            image=res;
            setImages((pre)=>{
                return [...pre,image]
            })
        }
    })

    return true;

}

export default storeImage;