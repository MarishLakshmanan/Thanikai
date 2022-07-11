import "../../styles/boxtoast.css";
import ReactDom from "react-dom";
import { motion } from "framer-motion";


function BoxToast({type,message,btntext,close,cb}){
    
    var img = require(`../../resources/${type}.png`);
    var heading = "Warning"
    var color = "#fcc867"
    if(type==="verified"){
        heading="Success";
        color="#20dd11"
    }

    function closeToast(){
        if(close){
        close(pre=>{
            pre.state = false;
            return Object.create(pre);
        })
    }
    }
    
    
    return ReactDom.createPortal(
        <div className="boxtoast-overlay">
            <motion.div className="boxtoast-container">
                <div className={type}></div>
                <img src={img} alt=""/>
                <span>
                <h2>{heading}</h2>
                <p>{message}</p>
                </span>
                <div style={(type==="verified")?{justifyContent:"center"}:{}}>
                    <button onClick={closeToast}>Cancel</button>
                    {(type==="verified")?"":
                    <button className="t-action-btn" style={{backgroundColor:color}} onClick={cb}>{btntext}</button>}
                </div>
            </motion.div>
        </div>
    ,document.getElementById("modal"))
}

export default BoxToast;