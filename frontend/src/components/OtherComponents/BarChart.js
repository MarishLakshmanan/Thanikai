import { useEffect } from "react";

function BarChart({data,label,n,name}){


    
    useEffect(()=>{
        const chart  = new window.Chart(
            document.getElementById(`bar-chart${n}`),
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
          label:name,
          backgroundColor:colors,
          hoverBorderWidth:5
        }]
    };

    const config = {
        type:"bar",
        data:mainData,
        options:{  
            maintainAspectRatio:false,
        }
    }

    return(
        <div className="bar-chart">
            <canvas id={`bar-chart${n}`} ></canvas>
        </div>
    )
}

export default BarChart;