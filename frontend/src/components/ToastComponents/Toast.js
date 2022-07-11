import "../../styles/toast.css"
import cancelIcon from "../../resources/cancel.png"

function Toast(props){

    var type = props.type;
    var heading
    var msg = props.msg;
    if(type==="info"){
        heading="Did you know ?"
    }else if(type==="verified"){
        heading="Yay! Everything worked"
    }else{
        heading="Uh oh, something went wrong"
    }
    var img = require(`../../resources/${type}.png`);
    
    function cancelToast(){
        props.cb((pre)=>{
            return pre.filter((toast)=>{ return toast.msg!==msg})
        })
    }

    setTimeout(cancelToast,6000)

    return (
        <div className="toast-container">
            <div className="toast-type">
                <div className={type}></div>
                <img src={img} alt="type-img" height="25px"/>
            </div>
            <div className="toast-content">
                <h3>{heading}</h3>
                <p>{msg}</p>
            </div>
            <div className="toast-close">
                <img onClick={cancelToast} src={cancelIcon} alt="cancel-img" height="10px"/>
            </div>
        </div>
    )
}

export default Toast