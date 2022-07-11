import "../../styles/inputtoast.css";
import ReactDom from "react-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendFormData } from "../../functions/requestAndResponses";

function InputToast({route,inputs,close,type,heading,setToast}){

    const [error,setError] = useState();


    function validateDetails(name,mobile,email){
        const mobileRE = /^[7-9][0-9]{9}$/;
        const emailRE = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    
        if(name==null || name===""){
          return "Please enter your name";
        }
        if(mobile==null || !mobileRE.test(mobile)){
          return "Please enter a valid Mobile no"
        }
        if(email==null || !emailRE.test(email)){
          return "Please enter a valid Email-ID"
        }
    
        return "200";
    
      }

      function validatePassword(pass,pass1,pass2){
        const passwordRE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if(pass1==null || pass2==null || pass==null || pass==="" || pass1==="" || pass2===""){
            return "Please enter password in all the boxes"
          }
      
          if(!passwordRE.test(pass1)){
            return "Your password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
          }
      
          if(pass1!==pass2){
            return "Passwords don't match"
          }
      
          return "200";
      }
    

    function closeToast(e){
        if(e!=null) e.preventDefault();
        close(pre=>{
            pre.state = false;
            return Object.create(pre);
        })
    }

    function submit(e){
        e.preventDefault();
        console.log("submit");
        const formData = new FormData(e.target);
        if(type==="password"){
            const result  = validatePassword(formData.get("pass"),formData.get("pass1"),formData.get("pass2"))
            if(result==="200"){
                sendFormData(route,formData,setToast).then((res)=>{
                    console.log(res);
                    if(res==="200"){
                        setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
                    }else{
                        setToast({state:true,type:"warning",message:"Wrong password!",btntext:"Close",close:setToast,cb:()=>{setToast({state:false})}})
                    }
                });;
                closeToast()
            }else{
                setError(result);
            }
        }else{
            const result  = validateDetails(formData.get("name"),formData.get("phone"),formData.get("email"))
            if(result==="200"){
                sendFormData(route,formData,setToast).then((res)=>{
                    console.log(res);
                    if(res==="200"){
                        setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
                    }
                });
                closeToast()
            }else{
                setError(result);
            }
        }
    }

    return ReactDom.createPortal(
        <div className="inputtoast-overlay">
            <motion.div className="inputtoast-container">
                <form onSubmit={submit}>
                    <h2>{heading}</h2>
                    <div>
                    {inputs.map((input,index)=>{
                        return <span key={index}>
                            <label htmlFor={input.className}>{input.placeHolder}</label>
                            <input name={input.name} type={input.type} className={input.className} defaultValue={(input.data) && input.data}/>
                            </span>
                    })}
                    {(error) && <p className="error">{error}</p>}
                    </div>
                    <div className="btn-container">
                    <button onClick={closeToast}>Close</button>
                    <button type="submit">Submit</button>
                </div>
                </form>
                
                
                
            </motion.div>
        </div>
    ,document.getElementById("modal"))
}

export default InputToast;