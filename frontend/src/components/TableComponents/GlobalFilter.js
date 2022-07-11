import { useState } from "react";
import { RiSearchEyeLine} from "react-icons/ri";

export const GlobalFilter = ({filter,setFilter})=>{

    
    const [edit,setType]=useState(true);

    return(
        <span className="global-span">
            {edit && <RiSearchEyeLine/>}
            <input id="global-input" value={filter || ""} placeholder="        Search in all the fields"
            onChange={(e)=>(setFilter(e.target.value))} onFocus={()=>{setType(false)}} onBlur={()=>{setType(true)}}/>
        </span>
    )
}