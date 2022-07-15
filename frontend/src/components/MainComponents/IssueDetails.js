import { useState, useEffect } from "react";
import { getFormData } from "../../functions/requestAndResponses";
import ScaleLoader from "react-spinners/ScaleLoader";
import IssueInput from "./subComponents/IssueInput";
import MainHeader from "./subComponents/MainHeader";
import BoxToast from "../ToastComponents/BoxToast";
import EditTable from "../TableComponents/EditTable";
import { IssueColumn } from "../../data/toolsData";
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
function IssueDetails() {
  function addbtn() {
    
    if(basic.length!==0){
    setEdit((pre) => !pre);
    }else{
      setToast({state:true,type:"warning",message:"Sorry you can't add an Issue without any basic information",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    }
  }



  useEffect(() => {
    getFormData(nav,"/get-issues",setIssue,setLoading,setToast)
    getFormData(nav,"/get-basic", setBasic, setLoading,setToast);
  }, []);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setIssue((old)=>{
      return old.map((row,index)=>{
        if(rowIndex===index){
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
    setIssue((old)=>{
      return old.filter((data)=>{
        return data.id!==issueID;
      })
    })
    setToast({state:false})
  }



  

  const [loading, setLoading] = useState(true);
  const [basic, setBasic] = useState([]);
  const [issue,setIssue] = useState([])
  const [toast, setToast] = useState({ state: false });
  const [edit, setEdit] = useState(false);
  const [skipPageReset,setSkipPageReset] = useState(false);
  const nav = useNavigate();

  const filterData = [
    {name:"basicid",type:"select",placeholder:"",value:[{id:"",nickname:"Choose Basic-ID"},...basic]},
    {name:"issuestatus",type:"select",placeholder:"",value:[{id:"",nickname:"Status"},{id:"pending",nickname:"Pending"},{id:"dropped",nickname:"Dropped"}]},
    {name:"issue",type:"issue",placeholder:"",value:null}
  ]

  const hiddenColumns = ["basicid"];


  return loading ? (
    <div className="loader">
      <ScaleLoader loading={loading} color="#2672ed" />
    </div>
  ) : (
    <div className="m-issue-container">
      <MainHeader title="Issues" cb={addbtn} edit={edit} />
      <div className="m-issue-body">
        {edit ? (
          <IssueInput setLoading={setLoading} basic={basic} setToast={setToast} />
        ) : 
        (issue!=="404")?
        (
          <div className="m-issue-view">
            <div>
              {(issue)?<EditTable data={issue} columns={IssueColumn} skipPageReset={skipPageReset} updateMyData={updateMyData} filterData={filterData} hiddenColumns={hiddenColumns} updateDatainDB={updateDatainDB} deleteDatainDB={deleteDatainDB} setToast={setToast}/>:"No"}
            </div>
          </div>
        ):<div className="empty-anim"><Lottie options={defaultOptions} height={400} width={400}/> <h2>Sorry! No Records found</h2></div>}
      </div>
      {toast.state ? (
        <BoxToast
          type={toast.type}
          message={toast.message}
          btntext={toast.btntext}
          close={setToast}
          cb={toast.cb}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default IssueDetails;
