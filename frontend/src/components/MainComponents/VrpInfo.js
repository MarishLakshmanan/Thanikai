
import VrpInput from "./subComponents/VrpInput";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useEffect, useState } from "react";
import MainHeader from "./subComponents/MainHeader"
import BoxToast from "../ToastComponents/BoxToast";
import { getFormData } from "../../functions/requestAndResponses";
import Lottie from "react-lottie";
import empty from "../../lotties/empty-anim.json"
import {useNavigate} from "react-router-dom"




const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: empty,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};



function VrpInfo() {

  useEffect(()=>{
    getFormData(nav,"get-all-vprp",setVprp,setLoading,setToast)
  },[])

  const[loading,setLoading] = useState(false);
  const[toast,setToast] = useState({state:false});
  const[vprp,setVprp] = useState([]);
  const[edit,setEdit] = useState(false);
  const[editData,setEditData]=useState();
  const nav = useNavigate();

  function addbtn(){
    setEdit((pre)=>(!pre));
  }

  function editVprp(e){
    e.stopPropagation();
    e.preventDefault();
    const id = e.target.name;
    const data = vprp[parseInt(id)];
    console.log(data);
    setEditData(data);
    setEdit(true);
  }

  return (
    (loading)?<div className="loader" ><ScaleLoader loading={loading} color="#2672ed" /></div>:
    <div className="m-vrp-container">
      <MainHeader title="VPRPs" cb={addbtn} edit={edit}/>
      <div className="m-vrp-body">
        {edit?<VrpInput setLoading={setLoading} edit={edit} data={editData} n="" setToast={setToast}/>:
        (vprp!=="404")?
        <div>
          {vprp.map((data,index)=>{
            return <VrpInput key={index} setLoading={setLoading} edit={edit} data={data} n={index} cb={editVprp} setToast={setToast}/>
          })}
        </div>:<div className="empty-anim"><Lottie options={defaultOptions} height={400} width={400}/> <h2>Sorry! No Records found</h2></div>}
        
      </div>
      {toast.state?<BoxToast type={toast.type} message={toast.message} btntext={toast.btntext} close={setToast} cb={toast.cb}/>:""}

    </div>
  );
}




export default VrpInfo;
