import "../../styles/nav.css"
import {NavLink} from "react-router-dom";
import {motion} from "framer-motion";
import { useState,useEffect } from "react";
import {MdSpaceDashboard } from "react-icons/md";
import { IoHelpBuoySharp,IoArchive,IoLogOut } from "react-icons/io5";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { GoIssueReopened,GoIssueClosed } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import avatar from "../../resources/avatar1.png"

import axios from "axios";



function Nav(){

    const [open,setOpen] = useState(false);
    const [navSize,setNavSize] = useState("60px");
    const nav = useNavigate();
    
    useEffect(()=>{
        if(window.screen.width<1000){
            setNavSize("0px")
        }else{
            setNavSize("50px")
        }
    },[])

    

    function toggleNav(){
        setOpen((pre)=>!pre)
    }

    window.addEventListener("resize",(e)=>{
        if(e.target.innerWidth<1000){
            setNavSize("0px")
        }else{
            setNavSize("50px")
        }
    })
    const variants = {
        show:{
            width:"auto",
            opacity:"1"
        },
        hide:{
            width:"0",
            opacity:"0"
        }
    }

    function highlight({isActive}){
       if(isActive){
           return{
               backgroundColor:"#fff",
               color:"#332deb",
               boxShadow: "0px 5px 10px rgb(126, 126, 126),0px -5px 10px rgb(126, 126, 126)"
           }
       }
    }

    const fontStyle={
        width:"25px",
        fontSize:"25px"
    }
    return(
        <motion.div  className="nav-container" 
        animate={{width:open?(navSize==="0px")?"100vw":"300px":(navSize==="0px")?"0px":"50px"}}
        >
            <motion.button onClick={toggleNav}  className="nav-btn" style={{scale:"1"}} whileHover={{scale:"1.2"}} whileTap={{scale:"0.9"}}><GiHamburgerMenu style={fontStyle}/></motion.button>
            <div className="nav-items">
                <ul>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/"><MdSpaceDashboard style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">Dashboard</motion.p>}</NavLink></li>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/vrp-assist"><IoHelpBuoySharp style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">VPRP</motion.p>}</NavLink></li>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/basic-information"><BsFillInfoSquareFill style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">Basic Information</motion.p>}</NavLink></li>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/issue-details"><GoIssueReopened style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">Issues</motion.p>}</NavLink></li>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/action-taken"><GoIssueClosed style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">Actions</motion.p>}</NavLink></li>
                    <li><NavLink onClick={setOpen.bind(this,false)} style={highlight} to="/view"><IoArchive style={fontStyle} />{open && <motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">View Records</motion.p>}</NavLink></li>

                </ul>
            </div>
            <motion.div className="nav-user">
                <span>
                <img src={avatar} alt="" />

                <span><p>{localStorage.getItem("name")}</p>
                <p style={{fontSize:"14px"}} >{localStorage.getItem("email")}</p>
                </span>
                </span>
                <button onClick={logout.bind(this,nav)}  className="nav-logout"><IoLogOut style={fontStyle}/><motion.p animate={open?"show":"hide"} variants={variants}  className="nav-heading">Logout</motion.p></button>
            </motion.div>
        </motion.div>
    )
    
}

async function logout(nav) {
    const rtoken = localStorage.getItem("rtoken");
    localStorage.clear();
    const res = await axios.delete("/logout",{headers : {"authorization" : `Bearer ${rtoken}`},crossdomain:true})
    console.log(res.data);
    nav("/auth")
}

export default Nav;