import { useParams } from "react-router-dom";
import { useState } from "react";
import viewIcon from "../resources/view.png";
import hideIcon from "../resources/hide.png";
import Toast from "../components/ToastComponents/Toast";
import axios from "axios";
import "../styles/passwordreset.css"
import logo from "../resources/logo.png"
import { useNavigate } from "react-router-dom";



function PasswordReset(){

    const {token,id} = useParams();
    const [passview,setpassView] = useState(false);
    const [toasts,setToasts] = useState([]);
    const nav = useNavigate();



    function togglePassView(){
        setpassView((pre)=>{
          if(!pre){
            document.getElementById("c-password").type = "text"
          }else{
            document.getElementById("c-password").type = "password"
          }
          return !pre
        })
        
      }

      function changePassword(e){
        e.preventDefault();
        const password = document.getElementById("c-password").value;
        const apassword = document.getElementById("c-password2").value;
        const passwordRE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if(password==null || apassword==null || password==="" || apassword===""){
            callToast("warning","Please enter password in both the boxes");
        }
        else if(!passwordRE.test(password)){
            callToast("info","Your password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.")
        }
        else if(password!==apassword){
            callToast("warning","Passwords don't match");
        }else{
            const data = {token:token,id:id,password:password};
            axios.post("/reset-password",data).then((res)=>{
                if(res.data.code==="200"){
                    callToast("verified","Your password has been successfully changed you will be redirected to login page")
                    setTimeout(()=>{nav("/auth")},3000)
                }else if(res.data.code==="404"){ 
                    callToast("warning","User not found");
                }else{
                    callToast("warning","Are you trying to hack me ?");
                }
            });
        }
      }

      function callToast(type,msg){
        setToasts((pre)=>{
          return [...pre,{
            msg:msg,
            type:type,
          }]
        })
      }

      const style = {
        display:"flex",
        alignItems:"center",
        position:"absolute",
        top:"30px",
        left:"30px"
      }
    return(
        <div className="reset-password-container">
          <div style={style}>
            <img src={logo} alt="" width="50px" style={{boxSizing:"border-box",backgroundColor:"white",borderRadius:"50%",marginRight:"5px"}} />
            <h1 style={{color:"white"}}>Thanikai</h1>
        </div>
            <div className="reset-password">
                <h1>Change Password</h1>
                <form>
                <label>Enter new Password:</label>
                <span>
                    <input type="password" name="pass1" id="c-password" />
                    <img src={passview?viewIcon:hideIcon} alt="passwordHide" onClick={togglePassView} />
                </span>
                <br />
                <label>Confirm Password</label>
                <input type="password" name="pass2" id="c-password2" />
                </form>
                <button onClick={changePassword}>Change</button>
            </div>
            <div className="toasts-container">
                {toasts.map((toast,index)=>{
                    return <Toast key={index} id={index} type={toast.type} msg={toast.msg} cb={setToasts} />
                })}
            </div>
        </div>
    )
}

export default PasswordReset;