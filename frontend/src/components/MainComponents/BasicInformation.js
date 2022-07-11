import "../../styles/main.css";
import { useState, useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";
import { getFormData } from "../../functions/requestAndResponses";
import BasicInput from "./subComponents/BasicInput";
import MainHeader from "./subComponents/MainHeader";
import BoxToast from "../ToastComponents/BoxToast";
import Lottie from "react-lottie";
import empty from "../../lotties/empty-anim.json"
import {useNavigate} from "react-router-dom"


function BasicInformation() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [toast,setToast] = useState({state:false});
  const [edit,setEdit] = useState(false);
  const [editData,setEditData] = useState();
  const nav = useNavigate();


  function addbtn() {
    setEdit((pre)=>(!pre));
  }

  useEffect(() => {
    getFormData(nav,"/get-basicinfo-vprp", setData, setLoading,setToast);
  }, []);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: empty,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  function editBasic(e){
    e.preventDefault();
    const id = e.target.name;
    const edit = data.basic[parseInt(id)];
    setEditData(edit);
    setEdit(true);
  }


  return loading ? (
    <div className="loader">
      <ScaleLoader loading={loading} color="#2672ed" />
    </div>
  ) : (
    <div className="m-basic-container">
      <MainHeader title="Basic-information" cb={addbtn} edit={edit} />
      <div className="m-basic-body">
        {console.log(data)}
        {edit?<BasicInput vprp={data.vprp} setLoading={setLoading} edit={edit} n="" data={editData} setToast={setToast}/>:
          (data!=="404" && data!=null)?
          <div className="m-basic-view">
           {data.basic.map((row,index)=>{
             return <BasicInput key={index} vprp={data.vprp} setLoading={setLoading} edit={edit} n={index.toString()} data={row} cb={editBasic} setToast={setToast}/>
           })}
          </div>:<div className="empty-anim"><Lottie options={defaultOptions} height={400} width={400}/> <h2>Sorry! No Records found</h2></div>
        }
        
      </div>
      {toast.state?<BoxToast type={toast.type} message={toast.message} btntext={toast.btntext} close={setToast} cb={toast.cb}/>:""}
    </div>
    
  );
}

export default BasicInformation;
