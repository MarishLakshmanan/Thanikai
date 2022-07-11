import axios from "axios";
async function checkAuth(){
    try{
        const atoken = localStorage.getItem("atoken");
        const rtoken = localStorage.getItem("rtoken");
        //Checking Access token
        if(!atoken) return false;
        const res = await axios.get("/checkAtoken",{headers : {"authorization" : `Bearer ${atoken}`},crossdomain:true})
        if(res.data.code==="200") return true;
        if(res.data.code==="204") return false;
        if(res.data.code==="401"){
            return await checkRtoken(rtoken).then((result)=>{
                return result;
            });
        }
    }
    catch (e){
        console.log(e);
    }
    
}

async function checkRtoken(rtoken){

            //Checking Refresh token

            if(!rtoken) return false;
            const res = await axios.get("/checkRtoken",{headers : {"authorization" : `Bearer ${rtoken}`},crossdomain:true})
            
            if(res.data.code==="200"){
                localStorage.setItem("atoken",res.data.atoken);
                return true;
            }else {
                return false;
            }
}

export {checkAuth,checkRtoken}