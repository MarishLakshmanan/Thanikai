import Input from "../../InputComponents/Input";
import { vrpInfo } from "../../../data/toolsData";
import { deletedData, fetchVPRPInfo } from "../../../functions/requestAndResponses";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete,MdArrowDropDownCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function VrpInput({ setLoading, data, edit, n, cb ,setToast}) {
  const [addOn, setAddOn] = useState("");
  const [open,setOpen] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    if (n !== undefined) setAddOn(n.toString());
    else setAddOn("");
    if(data)populateForm(data)
  }, []);

  async function populateForm(data) {

    for (var [key, value] of Object.entries(data)) {
      
      const element = await document.getElementById(key + n);
      if (key === `gender`) {
        document.getElementById(value + n).checked = true;
      }
      if (element) {
        element.setAttribute("value", value);
      }
    }

    if(edit){
      makeFormEditable();
    }else{
      makeFormReadOnly();
    }
  }

  async function makeFormReadOnly() {
    const formID = `m-vrp-form${n}`;
    const form = document.getElementById(formID);
    const elements = await form.elements;

    for (var i = 0, len = elements.length; i < len; ++i) {
      elements[i].readOnly = true;
    }
  }

  function makeFormEditable() {
      const elements = document.getElementById("m-vrp-form").elements;

      for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].readOnly = false;
      }
  }

  function deleteEntry(){
    const obj = {className:"vprp",id:data.id}
    deletedData("/delete-data",obj,setLoading,setToast);
  }

  const variants = {
    open:{height:"auto"},
    close:{height:edit?"auto":"99px"}
  }

  return (
    <motion.div className="m-vrp-add-container" variants={variants} animate={open?"open":"close"} style={{height:"99px"}} >
      <form
        onSubmit={(e) => {
          if(data!==undefined){
            fetchVPRPInfo(nav,e,setLoading,edit,setToast,data.id);
          }else{
            fetchVPRPInfo(nav,e,setLoading,false,setToast);
          }
          
        }}
        id={`m-vrp-form${addOn}`}
        encType="multipart/form-data"
      >
        <div className="m-inputs-overlay">
          <h3>{edit ? "Add VPRP" : data.name}</h3>
          {!edit && (<div>
            <motion.button
              whileHover={{ scale: "1.2" }}
              whileTap={{ scale: "0.9" }}
              onClick={cb}
              style={{scale:"1"}}
              name={addOn}
              className="btn"
            >
              <RiEdit2Fill size="25px" />
            </motion.button>
            <motion.button
            whileHover={{ scale: "1.2" }}
            whileTap={{ scale: "0.9" }}
            onClick={(e)=>{e.preventDefault();setToast({state:true,type:"warning",message:"Do you really want to delete this Entry ?",btntext:"Yes",cb:deleteEntry})}}
            name={addOn}
            style={{scale:"1"}}
            className="btn"
          >
            <MdDelete size="25px" />
          </motion.button>
          <motion.button
            whileHover={{ scale: "1.2" }}
            whileTap={{ scale: "0.9" }}
            onClick={(e)=>{e.preventDefault();setOpen((pre)=>(!pre))}}
            name={addOn}
            style={{scale:"1"}}
            className="btn"
          >
            <MdArrowDropDownCircle size="25px" />
          </motion.button>
          </div>
          )}
          <div className="m-vrp-inputs">
            {vrpInfo.map((data, index) => {
              return (
                <Input
                  k={data.k + addOn}
                  key={index}
                  name={data.name}
                  type={data.type}
                  values={data.values}
                  n={n}
                  required={data.required}
                />
              );
            })}
          </div>
        </div>
        {edit && (
          <button type="submit" className="m-vrp-submit">
            Submit
          </button>
        )}
      </form>
    </motion.div>
  );
}

export default VrpInput;
