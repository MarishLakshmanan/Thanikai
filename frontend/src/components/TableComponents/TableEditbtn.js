
export const TableEdit = ({row,editableRowIndex,setEditableRowIndex,updateDatainDB,deleteDatainDB,setToast})=>{
    function makeEditable(){
        const rowIndex = row.index;
        if(rowIndex===editableRowIndex){
            setEditableRowIndex(null);
            const updatedRow = row.original;
            const arr = Object.keys(updatedRow);
            if(arr.includes("issuetype")){
                updatedRow.className ="issue";
            }else if(arr.includes("dateofhlc")){
                updatedRow.className="action";
            }
            console.log(updatedRow);
            updateDatainDB(updatedRow);

        }else{
            setEditableRowIndex(rowIndex)
        }
    }

    function deleteData(){
        var obj = {};
        obj.id = row.original.id;
        const arr = Object.keys(row.original);
        if(arr.includes("issuetype")){
            obj.className ="issue";
        }else if(arr.includes("dateofhlc")){
            obj.className="action";
        }
        deleteDatainDB(obj)
    }

    
    return (
        
        <div className="table-a-container">
            <button onClick={()=>{makeEditable()}}>{(row.index===editableRowIndex)?"Save":"Edit"}</button>
            <button onClick={()=>setToast({state:true,type:"warning",message:"Do you really want to delete this Entry ?",btntext:"Yes",cb:deleteData})}>Delete</button>
        </div>
    )
}

