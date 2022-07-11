
function Input({k,name,type,values,required,n}){
    if(type==="radio"){
        return (
            <span className="m-input-radio">
            {values.map((data,index)=>{
                return <span key={index}><label htmlFor={data} >{data}</label>
            {index===0?
                <input style={{boxShadow:"none"}} type={type} name={k} value={data} id={data+n} />:<input style={{boxShadow:"none"}} type={type} name={k} value={data} id={data+n} required/>}
                </span>
            })}
            </span>
        )
    }
    if(type==="select"){
        return (<span className="m-input-container">
            <label>{name}</label>
            <select name={k}>
                {values.map((data,index)=>{
                    return <option key={index} value={data}>{data}</option>
                })}
            </select>
            </span>)

    }
    return (<span className="m-input-container">
        <label>{name} </label>
        <input id={k} type={type} autoCorrect="off" autoComplete="on" name={k} required={required}  min="0"></input>
    </span>)
}

export default Input;