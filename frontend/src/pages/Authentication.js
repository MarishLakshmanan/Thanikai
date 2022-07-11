import "../styles/authentication.css";
import "../styles/outsidenav.css";
import Signup from "../components/AuthorizationComponents/Signup";
import Login from "../components/AuthorizationComponents/Login";
import {useState} from "react";
import Toast from "../components/ToastComponents/Toast";
import { IoCall,IoReceipt,IoLogIn } from "react-icons/io5";
import { Link } from "react-router-dom";
import auditIcon from "../resources/audit.png"
import logo from "../resources/logo.png"
import { AiFillHome } from "react-icons/ai";



function Authentication() {

    const [newUser,setNewUser] = useState(true);
    const [toasts,setToasts] = useState([]);

    function changeInput(e){
      if(e)e.preventDefault();

      if(window.innerWidth<=620){
        document.getElementsByClassName("right-auth-container")[0].scrollIntoView({behavior:"smooth"})
        
      }
    
      document.getElementById("auth-move").classList.toggle("move");
      document.getElementsByClassName("img-container")[0].classList.toggle("move");
      
    }

  return (
    <div className="auth-container">
      <div className="nav-auth-container">
      <div style={{display:"flex",alignItems:"center"}}>
        <img src={logo} alt="" width="50px" style={{boxSizing:"border-box",backgroundColor:"white",borderRadius:"50%"}} />
        <h1>Thanikai</h1>
        </div>
        <ul>
        <li><Link to="/auth" onClick={changeInput}><IoLogIn color="#03045e"/></Link></li>
        <li><Link to="/billing"><IoReceipt color="#03045e"/></Link></li>
        <li><Link to="/contact"><IoCall color="#03045e"/></Link></li>
        <li><Link to="/"><AiFillHome color="#03045e"/></Link></li>
          
        </ul>
      </div>
      <div className="main-auth-container">
        <div className="left-auth-container">
          <h1>SIMPLIFY AUDITING</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <button onClick={changeInput}>Get Started</button>
        </div>
        <div className="right-auth-container">
            <div className="img-container"><img src={auditIcon} alt=""></img></div>
            <div id="auth-move">
            {newUser?<Signup cb={setNewUser} toast={setToasts}/>:<Login cb={setNewUser} toast={setToasts}/>}
            </div>
        </div>
      </div>
      <div className="toasts-container">
        {toasts.map((toast,index)=>{
          return <Toast key={index} id={index} type={toast.type} msg={toast.msg} cb={setToasts} />
        })}
      </div>
    </div>
  );
}

export default Authentication;
