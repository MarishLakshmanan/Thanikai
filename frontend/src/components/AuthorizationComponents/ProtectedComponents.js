import { checkAuth} from "../../functions/authentications";
import { useEffect, useState } from "react";
import { Navigate , Outlet} from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

function ProtectedComponents(){
     

     const [loading,setLoading] =  useState(true);
     const [auth,setAuth] = useState(false);
     useEffect(()=>{
         checkAuth().then((res)=>{
             setAuth(res);
             setLoading(false);
         })
     },[])

     const loaderStyle = {
         width:"100%",
         height:"100vh",
         display:"flex",
         alignItems:"center",
         justifyContent:"center"
     }

    return (
        (loading)?<div style={loaderStyle}><ScaleLoader loading={loading} color="#2672ed"/></div>:(auth)?<Outlet />:<Navigate to={"/auth"} />
    )
}



export default ProtectedComponents;