import { useState, useEffect } from "react";
import { getFormData } from "../../functions/requestAndResponses";
import ScaleLoader from "react-spinners/ScaleLoader";
import ActionInput from "./subComponents/ActionInput";
import MainHeader from "./subComponents/MainHeader";
import BoxToast from "../ToastComponents/BoxToast";
import EditTable from "../TableComponents/EditTable";
import { ActionColumn } from "../../data/toolsData";
import { editFormData,deletedData } from "../../functions/requestAndResponses";
import Lottie from "react-lottie";
import empty from "../../lotties/empty-anim.json"
import { useNavigate } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: empty,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};


function ActionTaken() {
  function addbtn() {
    setEdit((pre) => !pre);
  }
  const [loading, setLoading] = useState(true);
  const [basic, setBasic] = useState([]);
  const [toast,setToast] = useState({state:false});
  const [edit, setEdit] = useState(false);
  const [action,setAction] = useState();
  const [skipPageReset,setSkipPageReset] = useState(false)
  const nav = useNavigate();


  

  useEffect(() => {
    getFormData(nav,"/get-actions",setAction,setLoading,setToast)
    getFormData(nav,"/get-basic", setBasic, setLoading,setToast);
  }, []);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setAction((old)=>{
      return old.map((row,index)=>{
        if(rowIndex===index){
          console.log(row);
          return {...old[rowIndex],[columnId]:value}
        }
        return row;
      })
    })
    
  }

  function updateDatainDB(data){
    editFormData("/update-data",data,setLoading,setToast)
  }

  function deleteDatainDB(obj){
    console.log(obj);
    const issueID = obj.id;
    deletedData("/delete-data",obj,setLoading,setToast)
    setAction((old)=>{
      return old.filter((data)=>{
        return data.id!==issueID;
      })
    })
    setToast({state:false});
  }

  const filterData = [
    {name:"basicid",type:"select",placeholder:"",value:basic}
  ]

  const hiddenColumns = ["basicid"];

  return loading ? (
    <div className="loader">
      <ScaleLoader loading={loading} color="#2672ed" />
    </div>
  ) : (
    <div className="m-action-container">
      <MainHeader title="Actions" cb={addbtn} />
      <div className="m-action-body">
        {edit?<ActionInput setLoading={setLoading} basic={basic} setToast={setToast} />:
        (action!=="404")?
        <div className="m-action-view">
            {(action) && (basic) && <EditTable data={action} columns={ActionColumn} skipPageReset={skipPageReset} updateMyData={updateMyData} filterData={filterData} hiddenColumns={hiddenColumns} updateDatainDB={updateDatainDB} deleteDatainDB={deleteDatainDB} setToast={setToast} />}
        </div>:<div className="empty-anim"><Lottie options={defaultOptions} height={400} width={400}/> <h2>Sorry! No Records found</h2></div>
        }
        
        
      </div>
      {toast.state?<BoxToast type={toast.type} message={toast.message} btntext={toast.btntext} close={setToast} cb={toast.cb}/>:""}
    </div>
  );
}

export default ActionTaken;
