import { useState ,useEffect} from "react"
import SearchableDropdown from "../InputComponents/SearchableDropdown";
import { issueTypes,issueCategories,issueSubCategories } from "../../data/filterData";

export const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    editableRowIndex,
    updateMyData,
    type
  }) => {
    const [value, setValue] =useState(initialValue)
  
    const className = "editableCellRow-"+index;
    const onChange = e => {
      setValue(e.target.value)
      console.log(index,id,value);
    }

    const onBlur = e =>{
      updateMyData(index,id,value)
    }

   function updateDropdownData(e){
     updateMyData(index,id,e.target.innerHTML)
   }
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    if(editableRowIndex===index){
      if(id==="issuetype"){
        return <SearchableDropdown placeholder="type to search" data={issueTypes} cb={updateDropdownData}/>
      }else if(id==="issuecategory"){
        return <SearchableDropdown placeholder="type to search" data={issueCategories} cb={updateDropdownData}/>
      }else if(id==="issuesubcategory"){
        return <SearchableDropdown placeholder="type to search" data={issueSubCategories} cb={updateDropdownData}/>
      }else if(id==="issuestatus"){
        return <select onChange={(e)=>{updateMyData(index,id,e.target.value)}}>
          <option value="Pending">Pending</option>
          <option value="Dropped">Dropped</option>
        </select>
      }
      else{
        return <input type={type} className={className} value={value} onChange={onChange} onBlur={onBlur} />
      }
      
    }else{
      return <p>{(type==="date")?new Date(value).toDateString():value}</p>
    }
    
    
  }