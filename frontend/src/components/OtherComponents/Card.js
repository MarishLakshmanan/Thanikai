import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Card({title,count,data,label,n}){


    const nav = useNavigate();
    useEffect(()=>{
        const chart  = new window.Chart(
            document.getElementById(`dough-chart${n}`),
            config
        );

        return () => {
            chart.destroy()
          }
    },[])

    var colors = ["#ff002b","#ff9e00","#20bf55","#f7aef8","#050505"]

    var mainData = {
        labels: label,
        datasets: [{
          data: data,
          backgroundColor:colors,
          hoverBorderWidth:5
        }]
    };

    const config = {
        type:"doughnut",
        data:mainData,
        options:{
            cutout:70,    
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    display:false
                }
            }
        }
    }
    
    function redirect(){
        if(title==="VPRP"){
            nav("/vrp-assist")
        }else if(title==="Basic information"){
            nav("/basic-information")
        }else if(title==="Issue"){
            nav("/issue-details")
        }else if(title==="Action"){
            nav("/action-taken")
        }
    }

    return(
        <div className="card" onClick={redirect}>
            <h1>{title}</h1>
            <div className="canvas-container" >
            <canvas id={`dough-chart${n}`} className="canvas-card" width="300px"></canvas>
            </div>
            <span style={{display:"none"}}>{count}</span>
        </div>
    )
}

export default Card;