import React from "react";
import {useEffect,useState} from "react"
import { getFormData } from "../../functions/requestAndResponses";
import ScaleLoader from "react-spinners/ScaleLoader";
import EditTable from "../TableComponents/EditTable";
import { columns } from "../../data/toolsData";
import BoxToast from "../ToastComponents/BoxToast"
import Lottie from "react-lottie";
import empty from "../../lotties/empty-anim.json"
import MainHeader from "./subComponents/MainHeader";
import { useNavigate } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: empty,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
function ViewReport(){

    useEffect(()=>{
        getFormData(nav,"/get-all",setData,setLoading,setToast)
    },[])
    const [data,setData] = useState();
    const [loading,setLoading] = useState(true);
    const [toast,setToast] = useState({state:false});
    const nav = useNavigate();

    const filterData = [
        {name:"state-district",type:"state",placeholder:"",value:null},
        {name:"block",type:"text",placeholder:"Block",value:null},
        {name:"panchayat",type:"text",placeholder:"Panchayat",value:null},
        {name:"issue",type:"issue",placeholder:"",value:null},
        {name:"issuestatus",type:"select",placeholder:"",value:[{id:"pending",nickname:"Pending"},{id:"dropped",nickname:"Dropped"}]},
      ]

      const hiddenColumns = ["issuetype","district","panchayat","block","startdate"]
    
    return (
      <div className="m-view-container">
        <MainHeader title="View report" cb={null}/>
        {loading?
        <div className="loader">
        <ScaleLoader loading={loading} color="#2672ed" />
        </div>:
        (data)?
        <EditTable columns={columns} data={data} filterData={filterData} hiddenColumns={hiddenColumns} />:
        <div className="empty-anim"><Lottie options={defaultOptions} height={400} width={400}/> <h2>Sorry! No Records found</h2></div>}
        {toast.state?<BoxToast type={toast.type} message={toast.message} btntext={toast.btntext} close={setToast} cb={toast.cb}/>:""}
      </div>
    )
}

export default ViewReport;