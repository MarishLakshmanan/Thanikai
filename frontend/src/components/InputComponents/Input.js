
function Input({k,name,type,values,required,n,change}){

    
    function calculate(){
        console.log("Here");
        if(change==="sac"){
            calculateSAC();
        }else if(change==="exp"){
            calculateEXP();
        }else{
            calculateEXPT();
        }
    }

    if(type==="radio"){
        return (
            <span className={`m-input-radio ${name}`}>
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
            <select id={k} name={k} >
                {values.map((data,index)=>{
                    return <option key={index} value={data}>{data}</option>
                })}
            </select>
            </span>)

    }
    return (<span className="m-input-container">
        <label>{name} </label>
        <input id={k} type={type} autoCorrect="off" autoComplete="on" name={k} required={required} onChange={(change!==undefined)?calculate:null}  min="0"></input>
    </span>)
}

function calculateSAC(){
    let value1=parseInt(document.getElementById("uwrgbyia").value);
    let value2=parseInt(document.getElementById("swrgbyia").value);
    let value3=parseInt(document.getElementById("mrgbyia").value);
    let target=document.getElementById("trgbyia");

    target.value = value1+value2+value3;
}

function calculateEXP(){
    let value1=parseInt(document.getElementById("noofdaysworked").value);
    let value2=parseInt(document.getElementById("perdaywages").value);
    let target=document.getElementById("honorariumexpenses");

    target.value = value1*value2;
    calculateEXPT();
}

function calculateEXPT(){
    let value1=parseInt(document.getElementById("honorariumexpenses").value);
    let value2=parseInt(document.getElementById("travelexpenses").value);
    let value3=parseInt(document.getElementById("p_p_b_expenses").value);
    let value4=parseInt(document.getElementById("videoexpenses").value);
    let value5=parseInt(document.getElementById("otherexpenses").value);
    let target=document.getElementById("totalexpenses");

    target.value = value1+value2+value3+value4+value5;
}



export default Input;