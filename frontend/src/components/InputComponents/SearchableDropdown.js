import { useState } from "react";
import "../../styles/sdropdown.css"

function SearchableDropdown({placeholder,data,cb,name}){
    if(typeof data[0]==='object'){
       data = data.map((parano)=>{
           return Object.values(parano)[0];
       })
    }
    const [filteredData,setFilteredData] = useState([]);
    const [value,setValue] = useState();

    function filterData(e){
        setValue(e.target.value);
        const searchKey = e.target.value;
        const arr = data.filter((type)=>{
            return type.toString().toLowerCase().includes(searchKey.toLowerCase());    
        })
        if(searchKey===""){
            setFilteredData([])
        }else{
            setFilteredData(arr);
        }
    }

    return(
        <div className="searchable-container">
            <input autoComplete="off" name={name} type="text" placholder={placeholder} onChange={filterData} value={value}/>

            {filteredData.length!==0 && 
            <div className="search-data-container">
                {filteredData.slice(0,10).map((type,index)=>{
                    return <div onClick={(e)=>{setValue(e.target.innerHTML);setFilteredData([]);cb(e)}} key={index}>{type}</div>
                })}
            </div>
            }
        </div>
    )
}

export default SearchableDropdown;