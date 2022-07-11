
export const ColumnFilter = ({column})=>{
    const{filterValue,setFilter} = column
    return(
        <div className="search-input">
            <input value={filterValue || ""}
            onChange={(e)=>(setFilter(e.target.value))} placeholder="Search" />
        </div>
    )
}