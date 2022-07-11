import { Link } from "react-router-dom";
import { IoReceipt,IoLogIn } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import logo from "../resources/logo.png"
import "../styles/contact.css"
import { useState } from "react";
import Toast from "../components/ToastComponents/Toast";
import axios from "axios";


function Contact() {

const [toasts,setToasts] = useState([]);

function callToast(type,msg){
    setToasts((pre)=>{
      return [...pre,{
        msg:msg,
        type:type,
      }]
    })
  }

function sendMessage(e){
    e.preventDefault();
    const name = document.getElementById("c-name").value;
    const mail = document.getElementById("c-mail").value;
    const message = document.getElementById("c-message").value;

    if(name==null || name===""|| mail ==null ||mail===""|| message == null||message===""){
        callToast("warning","Pls fill all the fields")
    }else{
        const data = {
            name,
            mail,
            message
        }
        axios.post("/send-message",data).then((res)=>{
            if(res.data.code==="200"){
               callToast("verified","Your message has been send Successfully"); 
            }else{
                callToast("warning","Pls try again later")
            }
        })
    }

    
}

  return (
    <div className="contact-container">
      <div className="nav-contact-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt=""
            width="50px"
            style={{
              boxSizing: "border-box",
              backgroundColor: "white",
              borderRadius: "50%",
              marginRight:"5px"
            }}
          />
          <h1>Thanikai</h1>
        </div>
        <ul>
          <li>
            <Link to="/auth">
              <IoLogIn color="#03045e" />
            </Link>
          </li>
          <li>
            <Link to="/billing">
              <IoReceipt color="#03045e" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <AiFillHome color="#03045e" />
            </Link>
          </li>
        </ul>
      </div>

      <div className="main-contact-container">
        <div className="form-container">
            <h1>Get in touch with us</h1>
            <form>
                <label>Your Name</label>
                <input name="username" id="c-name" type="text" required/>
                <br />
                <label>Mail</label>
                <input name="mail" id="c-mail" type="mail" required/>
                <br />
                <label>Message</label>
                {/* <input style={{height:"100px"}} name="message" id="c-message" type="text" required/> */}
                <textarea id="c-message" name="message" required />
                <br />
                <button onClick={sendMessage}>Submit</button>
            </form>
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

export default Contact;
