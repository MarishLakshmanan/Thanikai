import { useEffect } from "react";

function Card({title,count,data,label,n}){

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
    
    return(
        <div className="card">
            <h1>{title}</h1>
            <div className="canvas-container">
            <canvas id={`dough-chart${n}`} className="canvas-card" width="300px"></canvas>
            </div>
            <span>{count}</span>
        </div>
    )
}

export default Card;