import { motion } from "framer-motion";
import { RiAddCircleFill } from "react-icons/ri";
import { IoArrowBackCircleSharp } from "react-icons/io5";



function MainHeader({title,cb,edit}){
    return(
        <div className="m-main-header">
        <h2>{title}</h2>
        { (cb!=null) ?
        <motion.button
          className="m-main-add"
          whileHover={{ scale: "1.2" }}
          whileTap={{ scale: "0.9" }}
          style={{scale:"1"}}
          onClick={cb}
        >
          {(edit)?<IoArrowBackCircleSharp size="30px"/>:<RiAddCircleFill size="30px" />}
        </motion.button>:""}
      </div>
    )
}

export default MainHeader;