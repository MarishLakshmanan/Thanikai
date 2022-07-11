import { fetchIssueInfo } from "../../../functions/requestAndResponses";
import {useState} from "react"
import { issueInfo,issueTypes,issueCategories,issueSubCategories } from "../../../data/toolsData";
import Input from "../../InputComponents/Input";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function IssueInput({setLoading,basic,setToast}){

    function addIssue(e){
        e.preventDefault();
        
        
        setIssueType((pre)=>{
          var name = "issueType"+(count.length).toString();
          pre[name] = 0;
          console.log(pre)
          return pre;
        })
        
        setIssueCategory((pre)=>{
          var name = "issueCategory"+(count.length).toString();
          pre[name] = 0;
          console.log(pre)
          return pre;
        })
        
        setTimeout(()=>{
          console.log(issueType);
          console.log(issueCategory);
          setCount((pre)=>([...pre,1]))
        },1000)
        
        
        
      }
    
      function removeIssue(e){
        e.preventDefault();
        if(count.length>1){
          count.pop();
          const arr =[...count];
          setCount(arr);
        }
        
      }
    
      function set1(index,name,cb){
        cb((pre)=>{
          pre[name] = index;
          const obj = Object.create(pre);
          return obj
        })
      }

    
    const [count,setCount] = useState([1]);
    const [issueType,setIssueType] = useState({issueType0:0});
    const [issueCategory,setIssueCategory] = useState({issueCategory0:0});
    const nav = useNavigate();
    return(
        
        <div className="m-issue-add-container">
          <form id="m-issue-form" onSubmit={(e)=>{fetchIssueInfo(nav,e,setLoading,count.length,basic,setToast)}}>

            <div className="m-inputs-overlay">
              <h3>Select the Basic Information for the issues </h3>
              <div className="m-issue-inputs">
                <span className="m-input-container">
                  <label>Basic Info:</label>
                  <select required name="basicID">
                    {
                      basic.map((data)=>{
                        return <option value={data.id}>{data.nickname}</option>
                      })
                    }
                  </select>
                </span>
                <span className="addIssuebtns">
                  <button type="button" onClick={addIssue}>
                    <IoAddCircle />
                  </button>
                  <button type="button" onClick={removeIssue}>
                    <IoRemoveCircle />
                  </button>
                </span>
              </div>
            </div>
            {count.map((data,i)=>{
              return(
                <div key={i} className="m-inputs-overlay">
              <h3>Add Issue</h3>
              <div className="m-issue-inputs">

                <Input k={`parano${i}`} name="Para.no" type="number" required={true}/>
            
                <span className="m-input-container">
                  <label>Issue type</label>
                  <select name={`issueType${i}`} onChange={(e)=>{set1(e.target.selectedIndex,e.target.name,setIssueType)}} required>
                    {issueTypes.map((data)=>{
                      return <option value={data}>{data}</option>
                    })}
                  </select>
                  </span>
                  <span className="m-input-container">
                    <label>Issue Category</label>
                  <select name={`issueCategory${i}`} onChange={(e)=>{set1(e.target.selectedIndex,e.target.name,setIssueCategory)}} required>
                  {issueCategories[issueType[`issueType${i}`]].map((data)=>{
                      return <option value={data}>{data}</option>
                    })}
                  </select>
                  </span>
                  <span className="m-input-container">
                  <label>Issue Sub-Category </label>
                  <select name={`issueSubCategory${i}`} required>
                  {issueSubCategories[calcIssueSub(issueType[`issueType${i}`],issueCategory[`issueCategory${i}`])].map((data)=>{
                      return <option value={data}>{data}</option>
                    })}
                  </select>
                  </span>
                  {issueInfo.map((data, index) => {
                  return (
                    <Input
                      k={data.k+""+i}
                      key={index}
                      name={data.name}
                      type={data.type}
                      values={data.values}
                      required={data.required}
                    />
                  );
                })}
              </div>
            </div>
              )
            })}
            <button type="submit" className="m-issue-submit">
              Submit
            </button>
          </form>
        </div>
    )
}


function calcIssueSub(index,n){
    var step = 0;
    if(index===1){
      step=4;
    }else if(index===2){
      step=9
    }else if(index===3){
      step=20
    }
    return step+n;
  }

export default IssueInput;