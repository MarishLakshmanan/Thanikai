import axios from "axios";
import Nav from "../components/NavComponents/Nav";
import { useState,useEffect } from "react";
import { Outlet } from "react-router-dom";
import {motion} from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../resources/logo.png"

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API;

function Home(){

    
    const [topNav,settopNav] = useState(false);

    useEffect(()=>{
        if(window.screen.width<1000){
            settopNav(true)
        }else{
            settopNav(false)
        }
    },[])


    window.addEventListener("resize",(e)=>{
        if(e.target.innerWidth<1000){
            settopNav(true)
        }else{
            settopNav(false);
        }
    })

    const fontStyle={
        width:"40px",
        fontSize:"25px"
    }
   
    return (
        <div style={{boxSizing:"border-box",width:"100%",height:"100vh",display:"grid",gridTemplateColumns:"auto 1fr"}}>
            <Nav />
            <div className="m-body-container" style={{backgroundColor:"white",height:topNav?"calc(100vh - 60px)":"100vh"}}>
                {topNav?<motion.div initial={{height:"0px"}} animate={{height:"60px"}} style={{backgroundColor:"#03045e",width:"100%",height:"60px",display:"flex",justifyContent:"space-between",padding:"10px",boxSizing:"border-box"}}>

                
                <div style={{display:"flex",alignItems:"center"}}>
                <img src={logo} alt="" width="40px" />
                <h1 style={{color:"white"}}>Thanikai</h1>
                </div>  
                <motion.button onClick={()=>{document.querySelector(".nav-btn").click()}} style={{backgroundColor:"transparent" ,color:"white",border:"none"}} whileHover={{scale:"1.2"}} whileTap={{scale:"0.9"}}><GiHamburgerMenu style={fontStyle}/></motion.button>

                </motion.div>:""}
                <Outlet/>
            {/* <button onClick={()=>{document.querySelector(".nav-btn").click()}}><img src={pro} width="40px" alt=""/></button> */}
            </div>
        </div>
        
    )
}






export default Home;