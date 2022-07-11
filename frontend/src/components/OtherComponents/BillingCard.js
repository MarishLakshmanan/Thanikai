import basic from "../../resources/basic.png";
import best from "../../resources/best.png";
import pro from "../../resources/pro.png";
import "../../styles/billingcard.css"
import axios from "axios";
import { useState } from "react";
import { checkRtoken } from "../../functions/authentications";
import { useNavigate } from "react-router-dom";



function BillingCard(props) {


  const Navigate = useNavigate();
  const [order,setOrder] = useState();
    var img;
    var color;
    var month;
    var price;
    var fontColor="#000"
    if(props.type==="Basic") {
        img=basic;
        color="rgb(223 223 223)";
        month="1";
        price="99"
    }
    if(props.type==="Best") {
        img=best;
        color="#1a1c29";
        month="3";
        fontColor="#fff"
        price="249"
    }
    if(props.type==="Pro"){
        img = pro;
        color="#rgb(223 223 223)"
        month="12";
        price="999"
    }

    var options = {
      "key":process.env.REACT_APP_RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
      "amount": (price+"00"), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Project A",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": async function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          console.log(response);
          response.order_id = order;
          response.email = localStorage.getItem("email");
          response.month = month;
          const result = await axios.post("/payment-verify",{response})
          if(result.data.code==="200"){
            Navigate("/",{replace:true})
          }else{
            props.setToast({state:true,type:"warning",message:"Sorry something went wrong if the money is debited from your account please contact us",btntext:"OK",close:props.setToast,cb:()=>{props.setToast({state:false})}})
          }
      },
      "theme": {
          "color": "#3399cc"
      }
  };
  var rzp1 = new window.Razorpay(options);
  rzp1.on('payment.failed', function (response){
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
  });

    async function payment(){
    const atoken = localStorage.getItem("atoken");
    const rtoken = localStorage.getItem("rtoken");

    const resA = await axios.post("/get-orderid",{amount:(price+"00")}, {
      headers: {
        authorization: `Bearer ${atoken}`,
        "Content-Type": "multipart/form-data",
      },
      crossdomain: true,
    });


    if(resA.data.code==="200"){
      setOrder(resA.data.data);
      setTimeout(()=>{rzp1.open()},1000);
    }else if (resA.data.code === "401") {
      return await checkRtoken(rtoken).then(async (resR) => {
         if (resR) {
           const refreshedAToken = localStorage.getItem("atoken");
           const result = await axios.post("/get-orderid", {amount:(price+"00")}, {
             headers: {
               authorization: `Bearer ${refreshedAToken}`,
               "Content-Type": "multipart/form-data",
             },
             crossdomain: true,
           });
           if (result.data.code === "200") {
            setOrder(resA.data.data);
            setTimeout(()=>{rzp1.open()},1000);
           }else if(result.data.code==="202"){
            props.setToast({state:true,type:"warning",message:"You Already have an ongoing subscription",btntext:"OK",close:props.setToast,cb:()=>{props.setToast({state:false})}})
          }else {
             props.setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:props.setToast,cb:()=>{props.setToast({state:false})}})
             return false;
           }
         } else {
           props.setToast({state:true,type:"warning",message:"You are not authorized please login to continue",btntext:"Login",close:props.setToast,cb:()=>{<Navigate to="/auth"/>}})
           return false;
         }
       });
    }else if(resA.data.code==="202"){
      props.setToast({state:true,type:"warning",message:"You Already have an ongoing subscription",btntext:"OK",close:props.setToast,cb:()=>{props.setToast({state:false})}})
    }
    else{
      props.setToast({state:true,type:"warning",message:"Sorry something went wrong please try again",btntext:"OK",close:props.setToast,cb:()=>{props.setToast({state:false})}})
    }

    }

    
  return (
    <div  className="b-card-container" style={{backgroundColor:color,color:fontColor}}> 
      <div className="b-card-top">
        <img width="70px" src={img} alt="basic-img" />
        <span>
        <h1>{props.type}</h1>
        <p>&#8377;{price}</p><span>/user</span>
        </span>
       
      </div>
      <div className="b-card-bottom">
        <p>You can use our services for</p>
        <h1>{month}</h1><span>months</span>
        <button onClick={payment}>Choose Plan</button>
      </div>
    </div>
  );
}

export default BillingCard;
