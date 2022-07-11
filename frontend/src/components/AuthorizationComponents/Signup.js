import "../../styles/cred.css";
import viewIcon from "../../resources/view.png";
import hideIcon from "../../resources/hide.png";
import {useState} from "react"
import axios from "axios"



function Signup(props) {

  const [passview,setpassView] = useState(false);

  function toggle(e) {
    if(e){e.preventDefault();}
    
    props.cb(false);
  }

  function callToast(type,msg){
    props.toast((pre)=>{
      return [...pre,{
        msg:msg,
        type:type,
      }]
    })
  }

  function submit() {
    const name = document.getElementById("s-username").value;
    const mobile = document.getElementById("s-mobile").value;
    const email = document.getElementById("s-email").value;
    const password = document.getElementById("s-password").value;
    const apassword = document.getElementById("s-apassword").value;
    const checked  = document.getElementById("terms").checked; 
  
    const validation = validateInput(name,mobile,email,password,apassword,checked);

    if(validation==="200"){
      if(checked){
        const data = {
          name:name,phone:mobile,email:email,password:password
        }
        registerUser(data);
      }else{
        callToast("warning","Please read the terms and conditions")
      }
    }else{
      
      callToast("warning",validation)
    }

  }

  function validateInput(name,mobile,email,password,apassword,checked){
    const mobileRE = /^[7-9][0-9]{9}$/;
    const passwordRE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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

    if(password==null || apassword==null || password==="" || apassword===""){
      return "Please enter password in both the boxes"
    }

    if(!passwordRE.test(password)){
      return "Your password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    }

    if(password!==apassword){
      return "Passwords don't match"
    }

    if(!checked){
      return "Please read the terms and conditions"
    }

    return "200";

  }

  function togglePassView(){
    setpassView((pre)=>{
      if(!pre){
        document.getElementById("s-password").type = "text"
      }else{
        document.getElementById("s-password").type = "password"
      }

      return !pre
    })
    
  }

  function registerUser(data){
    axios.post("registerUser",data).then((res)=>{
      if(res.data.code==="200"){
        callToast("verified","Your are registered")
        toggle();
      }else if(res.data.code==="23505"){
        callToast("warning","User already exists")
      }else{
        callToast("warning","If you continue facing this issue contact us")
      }
    })
  }

  return (
    <div className="cred">
      <h1>Sign up</h1>
      <form>
        <label>Enter your name:</label>
        <input type="text" name="username" id="s-username" />
        <label>Mobile no:</label>
        <input type="mobile" name="phone" id="s-mobile" />
        <label>Email address:</label>
        <input type="email" name="email" id="s-email" />
        <label>Password:</label>
        <span>
          <input type="password" name="passw" id="s-password" />
          <img src={passview?viewIcon:hideIcon} alt="passwordHide" onClick={togglePassView} />
        </span>
        <label>Re-enter password:</label>
        <input type="password" name="passw2" id="s-apassword" />
      </form>
      <span>
        <input type="checkbox" name="terms" id="terms" />
        <label> I have read the terms and condition</label>
      </span>
      <button onClick={submit}>Sign up</button>
      <p>
        Already have an account?{" "}
        <a href="/login" onClick={toggle}>
          Login
        </a>
      </p>
     
    </div>
  );
}

export default Signup;
