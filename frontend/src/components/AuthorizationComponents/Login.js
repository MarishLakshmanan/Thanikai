import "../../styles/cred.css";
import viewIcon from "../../resources/view.png";
import hideIcon from "../../resources/hide.png";
import {useState} from "react";
import axios from  "axios";
import {useNavigate} from "react-router-dom";


function Login(props) {

  const nav = useNavigate();
  const [forgot,setForgot] = useState(false);
  const [passview,setpassView] = useState(false);
    function toggle(e){
        e.preventDefault();
        props.cb(true);
    }

    function callToast(type,msg){
      props.toast((pre)=>{
        return [...pre,{
          msg:msg,
          type:type,
        }]
      })
    }

    function submit(){
      const email = document.getElementById("l-email").value;
      const password = document.getElementById("l-password").value;

      const validation = validateInput(email,password);
      if(validation==="200"){
        const data = {email:email,password:password};
        loginUser(data)
      }else{
        callToast("warning",validation)
      }
    }

    function validateInput(email,password){
      const passwordRE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const emailRE = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if(email==null || !emailRE.test(email)){
      return "Please enter a valid Email-ID"
    }

    if(password==null || password===""){
      return "Please enter password"
    }

    if(!passwordRE.test(password)){
      return "Your password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    }

    return "200";
    }

    function togglePassView(){
      setpassView((pre)=>{
        if(!pre){
          document.getElementById("l-password").type = "text"
        }else{
          document.getElementById("l-password").type = "password"
        }
        return !pre
      })
      
    }

    function loginUser(data){
      axios.post("/loginUser",data).then((res)=>{
        if(res.data.code==="200"){
          const atoken =  res.data.atoken;
          const rtoken = res.data.rtoken;
          localStorage.setItem("atoken",atoken);
          localStorage.setItem("rtoken",rtoken);
          localStorage.setItem("name",res.data.name);
          localStorage.setItem("email",res.data.email);
          callToast("verified","Your are successfully Logged In")
          if(res.data.subscription==="t"){
            nav("/");
          }else{
            nav("/billing")
          }
        }else if(res.data.code==="403"){
          callToast("warning","Wrong password")
        }else if(res.data.code==="404"){
          callToast("warning","User is not registered")
        }else{
          callToast("warning","If you continue facing this issue contact us")
        }
      })
    }

    function forgotPassword(){
      const email = document.getElementById("l-email").value;
      const emailRE = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      if(email==null || !emailRE.test(email)){
        callToast("warning","Please enter a valid Email-ID");
      }else{
        axios.post("/forgot-password",{email:email}).then((res)=>{
           if(res.data.code==="200"){
            callToast("verified","A Password reset link has been sent to your registered E-mail ID If you counldn't find it pls check in Spam")
           }else if(res.data.code==="404"){
            callToast("warning","This E-mail Id is not registered")
           }else{
            callToast("warning","Pls try again")
           }
        })
      }
    }

  return (
    <div className="cred">
      <h1>{(forgot)?"Forgot Password":"Login"}</h1>
      <form>
        <label>Email address:</label>
        <input type="email" name="username" id="l-email" />
        {!forgot && <label>Password:</label>}
        {!forgot && <span>
        <input type="password" name="username" id="l-password" />
        <img src={passview?viewIcon:hideIcon} alt="passwordHide" onClick={togglePassView} />
        </span>}
        
      </form>
      {/* <span>
        <input type="checkbox" name="terms" id="remember" />
        <label> Remember me</label>
      </span> */}
      <button onClick={(!forgot)?submit:forgotPassword}>{(forgot)?"Submit":"Login"}</button>
      <p>
        New user ? <a href="/login" onClick={toggle}>Signup</a>
      </p>
      <p style={{color:"#0085FF",textDecoration:"underline",cursor:"pointer"}} onClick={()=>{setForgot((pre)=>!pre)}} >
        Forgot password ?
      </p>
    </div>
  );
}

export default Login;
