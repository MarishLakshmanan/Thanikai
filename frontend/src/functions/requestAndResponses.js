import axios from "axios";
import { checkRtoken } from "../functions/authentications";
import { Navigate } from "react-router-dom";


async function sendFormData(nav,path, formData,setToast) {
  try {
    const atoken = localStorage.getItem("atoken");
    const rtoken = localStorage.getItem("rtoken");
    const resA = await axios.post(path, formData, {
      headers: {
        authorization: `Bearer ${atoken}`,
        "Content-Type": "multipart/form-data",
      },
      crossdomain: true,
    });
    if (resA.data.code === "401") {
     return await checkRtoken(rtoken).then(async (resR) => {
        if (resR) {
          const refreshedAToken = localStorage.getItem("atoken");
          const result = await axios.post(path, formData, {
            headers: {
              authorization: `Bearer ${refreshedAToken}`,
              "Content-Type": "multipart/form-data",
            },
            crossdomain: true,
          });
          if (result.data.code === "200") {
            return "200";
          }else if(result.data.code==="402"){
            setToast({state:true,type:"warning",message:"Sorry! currently you don't have any subsciption",btntext:"Billing",close:null,cb:()=>{nav("/billing",{replace:true})}})
          } else {
            setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
            return false;
          }
        } else {
          setToast({state:true,type:"warning",message:"You are not authorized please login to continue",btntext:"Login",close:setToast,cb:()=>{<Navigate to="/auth"/>}})
          return false;
        }
      });
    }else if(resA.data.code==="402"){
      setToast({state:true,type:"warning",message:"Sorry! currently you don't have any subsciption",btntext:"Billing",close:null,cb:()=>{nav("/billing",{replace:true})}})
    }
    else {
      return resA.data.code;
    }
  } catch (e) {
    console.log(e);
  }
}

async function getFormData(nav,path, setData, setLoading,setToast) {
  try {
    if (setLoading) {
      setLoading(true);
    }
    const atoken = localStorage.getItem("atoken");
    const rtoken = localStorage.getItem("rtoken");
    const resA = await axios.get(path, {
      headers: { authorization: `Bearer ${atoken}` },
    });
    if (resA.data.code === "200") {
      setData(resA.data.data);
      if (setLoading) {
        setLoading(false);
      }
    } else if (resA.data.code === "401") {
      checkRtoken(rtoken).then(async (resR) => {
        if (resR) {
          const Refreshedatoken = localStorage.getItem("atoken");
          const result = await axios.get(path, {
            headers: { authorization: `Bearer ${Refreshedatoken}` },
          });
          if (result.data.code === "200") {
            setData(result.data.data);
            if (setLoading) {
              setLoading(false);
            }
          }else if(resA.data.code==="402"){
            if (setLoading) {
              setLoading(false);
            }
            setToast({state:true,type:"warning",message:"Sorry! currently you don't have any subsciption you will be redirected to billing page in 5 seconds",btntext:"OK",close:null,cb:()=>{setToast(({state:false}))}})
            setTimeout(()=>{nav("/billing",{replace:true})},5000)
          }else{
            if(setLoading){
            setLoading(false);
            }
            setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"Contact us",close:setToast,cb:()=>{nav("/contact")}})
          }
        }
      });
    }else if(resA.data.code === "404") {
      if (setLoading) {
        setLoading(false);
      }
      setData(resA.data.code);
      setToast({state:true,type:"warning",message:"Sorry! data not found",btntext:"Contact us",close:setToast,cb:()=>{nav("/contact")}})
    }else if(resA.data.code==="402"){
      console.log("In 402");
      if (setLoading) {
        setLoading(false);
      }
      setToast({state:true,type:"warning",message:"Sorry! currently you don't have any subsciption you will be redirected to billing page in 5 seconds",btntext:"OK",close:null,cb:()=>{setToast(({state:false}))}})
      setTimeout(()=>{nav("/billing",{replace:true})},5000)
    }
    else {
      if (setLoading) {
        setLoading(false);
      }
      setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"Contact us",close:setToast,cb:()=>{nav("/contact")}})
    }
  } catch (e) {
    console.log(e);
  }
}

async function editFormData(path, data, setLoading,setToast) {
  setLoading(true);
  const atoken = localStorage.getItem("atoken");
  const rtoken = localStorage.getItem("rtoken");
  const resA = await axios.put(path, data,{
    headers: { authorization: `Bearer ${atoken}` },
  });
  if (resA.data.code === "200") {
    setLoading(false);
    setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
  } else if (resA.data.code === "401") {
    checkRtoken(rtoken).then(async (resR) => {
      if (resR) {
        const refreshedAToken = localStorage.getItem("atoken")
        const result = await axios.put(path,data, {
          headers: { authorization: `Bearer ${refreshedAToken}` },
        });
        if (result.data.code === "200") {
          setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}});
        }else{
          setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
        }
        setLoading(false);
      }else{
        setLoading(false);
        setToast({state:true,type:"warning",message:"You are not authorized please login to continue",btntext:"Login",close:setToast,cb:()=>{<Navigate to="/auth"/>}})
      }
    });
  }else{
    setLoading(false);
    setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
  }
}

async function deletedData(path, data, setLoading,setToast) {
  setLoading(true);
  const atoken = localStorage.getItem("atoken");
  const rtoken = localStorage.getItem("rtoken");
  const resA = await axios.delete(path, {
    headers: { authorization: `Bearer ${atoken}` },
    data: data,
  });
  if (resA.data.code === "200") {
    setLoading(false);
    setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}});
  } else if (resA.data.code === "401") {
    checkRtoken(rtoken).then(async (resR) => {
      if (resR) {
        const refreshedAToken = localStorage("atoken");
        const result = await axios.delete(path, {
          headers: { authorization: `Bearer ${refreshedAToken}` },
          data:data
        });
        if (result.data.code === "200") {
          setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}});
        }else{
          setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
        }
        setLoading(false);
      }else{
        setLoading(false);
        setToast({state:true,type:"warning",message:"You are not authorized please login to continue",btntext:"Login",close:setToast,cb:()=>{<Navigate to="/auth"/>}})
      }
    });
  }else{
    setLoading(false);
    setToast({state:true,type:"warning",message:"Sorry Something went wrong please try again if you continue to face problem please contact us through Email",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
  }
}

async function fetchVPRPInfo(nav,e, setLoading, edit,setToast,id) {
  e.preventDefault();
  setLoading(true);
  const form = document.getElementById("m-vrp-form");
  const formData = new FormData(form);
  if (edit) {
    formData.append("id", id);
    formData.append("className", "vprp");
    editFormData("/update-data", formData, setLoading,setToast);
  } else {
    sendFormData(nav,"/vrp", formData,setToast).then((res) => {
      if (res==="200") {
        setLoading(false);
        setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
      } else {
        setLoading(false)
      }
    });
  }
}

async function fetchBasicInfo(nav,e, setLoading, getIDs, images,setToast, edit, id, path) {
  e.preventDefault();
  setLoading(true);
  const form = document.getElementById("m-basic-form");
  var formData = new FormData(form);
  let result = getIDs(formData);

  if(typeof result==="string"){
    setLoading(false);
    setToast({state:true,type:"warning",message:`The VPRP ${result} is not present in the Database`,btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    return;
  }

  formData = result;
  var startDate = new Date (formData.get("startdate"));
  var endDate = new Date (formData.get("enddate"));
  var gsDate = new Date (formData.get("gsdate"));
  var sapFromDate = new Date (formData.get("sapfromdate"));
  var sapToDate = new Date (formData.get("saptodate"));
  if(startDate>=endDate){
    setLoading(false);
    setToast({state:true,type:"warning",message:"The SA Process start and end date are not in manner",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    return;
  }
  if(endDate>=gsDate){
    setLoading(false);
    setToast({state:true,type:"warning",message:"The Gram sabha Date is not in correct manner",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    return;
  }
  if(sapFromDate>=sapToDate){
    setLoading(false);
    setToast({state:true,type:"warning",message:"The SA dates are not in correct manner",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    return
  }

  for (var i = 0; i < images.length; i++) {
    formData.append("images", images[i], images[i].name);
  }


  
  if (edit) {
    formData.append("id", id);
    formData.append("className", "basic");
    formData.append("images", path);
    editFormData("/update-data", formData, setLoading,setToast);
  } else {
    sendFormData(nav,"/basic-info", formData,setToast).then((res) => {
      if (res==="200") {
        setLoading(false);
        setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})

      } else {
        setLoading(false);
      }
    });
  }
}

function fetchIssueInfo(nav,e, setLoading, count, basic,setToast) {
  e.preventDefault();
  setLoading(true);
  const form = document.getElementById("m-issue-form");
  var formData = new FormData(form);
  formData.append("count", count);
  const basicID = formData.get("basicID");
  basic.map((data) => {
    if (basicID === data.id.toString()) {
      formData.append("basicNickname", data.nickname);
    }
    return true;
  });
  sendFormData(nav,"/issue-details", formData,setToast).then((res) => {
    if (res==="200") {
      setLoading(false);
      setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    } else {
      setLoading(false);
    }
  });
}

function fetchActionInfo(nav,e, setLoading, count, basic,setToast) {
  e.preventDefault();
  setLoading(true);
  const form = document.getElementById("m-action-form");
  const formData = new FormData(form);
  formData.append("count", count);
  const basicID = formData.get("basicID");
  basic.map((data) => {
    if (basicID === data.id.toString()) {
      formData.append("basicNickname", data.nickname);
    }
    return true;
  });
  for(var i=0;i<count;i++){
    const para_no = formData.get(`paraNo${i}`);
    if(para_no==="no data"){
      setLoading(false)
      setToast({state:true,type:"warning",message:"Select a valid para no",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
      return false;
    }
  }
  sendFormData(nav,"/action-details", formData,setLoading,setToast).then((res) => {
    if(res==="200"){
      setLoading(false);
      setToast({state:true,type:"verified",message:"Success",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    }
    else if (res==="300") {
      setLoading(false);
      setToast({state:true,type:"warning",message:"Sorry there can't be duplicate values",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    }else if(res==="404"){
      setLoading(false);
      setToast({state:true,type:"warning",message:"That Para number is not registered in issues",btntext:"OK",close:setToast,cb:()=>{setToast({state:false})}})
    }
    else{
      setLoading(false)
    }
  });
}

export {
  sendFormData,
  getFormData,
  editFormData,
  fetchVPRPInfo,
  fetchBasicInfo,
  fetchIssueInfo,
  fetchActionInfo,
  deletedData,
};
