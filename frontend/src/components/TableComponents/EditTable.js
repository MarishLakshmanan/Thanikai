import "../../styles/table.css"
import {useTable,useFilters,useGlobalFilter,usePagination,useBlockLayout} from "react-table";
import { GlobalFilter } from "../TableComponents/GlobalFilter";
import { useEffect, useMemo, useState } from "react";
import { ColumnFilter } from "../TableComponents/ColumnFilter";
import FilterInput from "../TableComponents/FilterInput";
import { AiFillCaretLeft,AiFillCaretRight } from "react-icons/ai";
import TableToExcel from "@linways/table-to-excel";
import { FaFileExport } from "react-icons/fa";




function EditTable({data,columns,skipPageReset,updateMyData,filterData,hiddenColumns,updateDatainDB,deleteDatainDB,setToast}){


    const tableData = useMemo(()=>{
        return [...data];
    },[data])

    const tableColumn = useMemo(()=>{
        return [...columns];
    },[columns])


    useEffect(()=>{
        setHiddenColumns(hiddenColumns);
    },[])


    const defaultColumn = useMemo(()=>{
        return {
            Filter:ColumnFilter
        }
    },[])
    const [editableRowIndex,setEditableRowIndex] = useState(null);

    const tableInstance = useTable({data:tableData,columns:tableColumn,defaultColumn,autoResetPage:!skipPageReset,editableRowIndex,setEditableRowIndex,updateMyData,updateDatainDB,deleteDatainDB,setToast},useFilters,useGlobalFilter,usePagination,useBlockLayout);
    const{
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        setFilter,
        pageOptions,
        canPreviousPage,
        canNextPage,
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        setHiddenColumns,
    } = tableInstance;
    

    const {globalFilter,pageIndex} = state;

    function filterInfo(e,cb){
        if(cb){
            cb({index:e.target.selectedIndex,value:e.target.value});
        }
        setFilter(e.target.name,e.target.value);
    }

    function exportExcel(){
        TableToExcel.convert(document.getElementById("table1"));
    }

    return(
        <div>
            
            <div className="filter-container">
                {filterData.map((data,index)=>{
                    return <FilterInput name={data.name} type={data.type} placeholder={data.placeholder} cb={filterInfo} value={data.value}/>
                })}
                
            </div>
            <div className="utility-container">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                <button onClick={exportExcel} className="export"><FaFileExport/>Export</button>
            </div>
            
            <div className="table-container">
            <table id="table1"  {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup)=>(
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column)=>(
                                
                                <th {...column.getHeaderProps()}>{column.render("Header")}
                                <div>{column.canFilter ? column.render("Filter"):null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody  {...getTableBodyProps()}>
                {page.map((row)=>{
                    prepareRow(row);
                    return <tr {...row.getRowProps()}>
                        {row.cells.map((cell)=>(
                            <td {...cell.getCellProps}>{cell.render("Cell")}</td>
                        ))}
                    </tr>
                })}
                </tbody>
            </table>
            </div>
            <div className="pagination-container">
                <select className="filter-select" onChange={(e)=>{setPageSize(Number(e.target.value))}}>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                </select>
                <p style={{width:"40px"}} >{`${pageIndex+1} of ${pageOptions.length}`}</p>
                <button onClick={previousPage} disabled={!canPreviousPage}><AiFillCaretLeft style={{color:"white"}}/></button>
                <input placeholder="to Where ?" onChange={(e)=>{gotoPage(Number(e.target.value))}}></input>
                <button onClick={nextPage} disabled={!canNextPage}><AiFillCaretRight/></button>
            </div>
        </div>
    )
}
export default EditTable;