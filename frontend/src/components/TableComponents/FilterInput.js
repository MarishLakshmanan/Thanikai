import {useState} from "react"
import { issueTypes,issueCategories,issueSubCategories} from "../../data/toolsData";
import { states } from "../../data/districtData";
import "../../styles/filterinput.css"

function FilterInput({name,type,placeholder,cb,value}){
    
    const [basicState,setBasicState] = useState(0);
    const [issuetype,setIssuetype] = useState({index:0,value:"All"});
    const [issueCategory,setIssueCategory] = useState({index:0,value:"All"});
    if(type==="select"){
        return (
            <select className="filter-select" style={{marginTop:"10px"}} name={name} onChange={cb}>
              {value.map((data,index) => {
                return <option key={index} value={data.id}>{data.nickname}</option>;
              })}
            </select>
        )
    }

    if(type==="state"){
        return(
            
            <div className="filter-span">
                <select className="filter-select" placeholder="Select State" onChange={(e)=>{setBasicState(e.target.selectedIndex);}}>
                    {states.map((data,i)=>(
                        <option key={i} value={data.state}>{data.state}</option>
                    ))}
                </select>
                <select className="filter-select" placeholder="Select District" name="district" onChange={cb}>
                    {states[basicState].districts.map((data,i)=>(
                        <option key={i} value={data}>{data}</option>
                ))}
                </select>
            </div>
        )
    }

    if(type==="issue"){
        return(<div className="filter-span">
            <select className="filter-select" name="issuetype" placeholder="Issue type" onChange={(e)=>{cb.bind(e,setIssuetype)}}>
                    {issueTypes.map((data,i)=>(
                        <option key={i} value={data}>{data}</option>
                    ))}
                </select>
                <select className="filter-select" name="issuecategory" placeholder="Issue Categorires" onChange={(e)=>{cb(e,setIssueCategory)}}>
                    {issueCategories[issuetype.index].map((data,i)=>(
                        <option key={i} value={data}>{data}</option>
                    ))}
                </select>
                <select className="filter-select" name="issuesubcategory" placeholder="Issue sub categories" onChange={cb}>
                    {issueSubCategories[calcIssueSub(issuetype.index,issueCategory.index)].map((data,i)=>(
                        <option key={i} value={data}>{data}</option>
                    ))}
                </select>
        </div>)
    }
    
    return(
        <input className="filter-input" style={{marginTop:"10px"}} name={name} type={type} placeholder={placeholder} onChange={cb} />
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

export default FilterInput;