
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "../styles/billing.css";
import "../styles/outsidenav.css";
import BillingCard from "../components/OtherComponents/BillingCard";
import { Link } from "react-router-dom";
import BoxToast from "../components/ToastComponents/BoxToast";
import {useState} from "react";
import { EffectCoverflow } from "swiper";
import { IoCall,IoLogIn } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import logo from "../resources/logo.png"



function Billing() {


  const [toast,setToast] = useState({state:false});
  return (
    <div className="billing-container">
      <div className="nav-billing-container">
        <div style={{display:"flex",alignItems:"center"}}>
        <img src={logo} alt="" width="50px" />
        <h1>Thanikai</h1>
        </div>
        
        <ul>
        <li><Link to="/auth"><IoLogIn color="#03045e"/></Link></li>
        <li><Link to="/"><AiFillHome color="#03045e"/></Link></li>
        <li><Link to="/contact"><IoCall color="#03045e"/></Link></li>
        </ul>
      </div>

      {/* body section */}
      <div className="billing-body">
        <div className="billing-heading">
          <h1 style={{ color: "#3630dd" }}>Flexible </h1>
          <h1>Plans</h1>
          <p>Choose a plan that works best for you</p>
        </div>

        {/* Card section */}
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide="1"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            modules={[EffectCoverflow]}
            className="billing-card"
          >
            <SwiperSlide>
              <BillingCard type="Basic" setToast={setToast}/>
            </SwiperSlide>
            <SwiperSlide>
            <BillingCard type="Best" setToast={setToast}/>
            </SwiperSlide>
            <SwiperSlide>
            <BillingCard type="Pro" setToast={setToast}/>
            </SwiperSlide>
          </Swiper>
      </div>
      {toast.state?<BoxToast type={toast.type} message={toast.message} btntext={toast.btntext} close={setToast} cb={toast.cb}/>:""}
    </div>
  );
}

export default Billing;
