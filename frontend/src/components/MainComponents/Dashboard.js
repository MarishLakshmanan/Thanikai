import { useState, useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import Card from "../OtherComponents/Card";
import "../../styles/dashboard.css";
import { getFormData } from "../../functions/requestAndResponses";
import BoxToast from "../ToastComponents/BoxToast";
import InputToast from "../ToastComponents/InputToast";
import { useNavigate } from "react-router-dom";
import avatar from "../../resources/avatar1.png";
import { IoPersonAdd,IoReceipt } from "react-icons/io5";
import { CgPassword } from "react-icons/cg";
import BarChart from "../OtherComponents/BarChart";
import { FaUserEdit } from "react-icons/fa";


function Dashboard() {
  useEffect(() => {
    getFormData(nav, "/dashboard", setData, setLoading, setToast);
  }, []);


  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [toast, setToast] = useState({ state: false });
  const [inputToast, setInputToast] = useState({ state: false });
  const nav = useNavigate();


  function editpassword() {
    const inputs = [
      {
        type: "password",
        name: "pass",
        className: "c-password",
        placeHolder: "Enter your password",
      },
      {
        type: "password",
        name: "pass1",
        className: "c-password1",
        placeHolder: "Enter new password",
      },
      {
        type: "password",
        name: "pass2",
        className: "c-password2",
        placeHolder: "Re-enter password",
      },
    ];
    const route = "/change-password";
    setInputToast({
      state: true,
      route,
      inputs,
      type: "password",
      heading: "Change Password",
    });
  }

  function editpersonal() {
    const inputs = [
      {
        type: "text",
        name: "name",
        className: "c-text",
        placeHolder: "Change your Name",
        data: data[0].name,
      },
      {
        type: "phone",
        name: "phone",
        className: "c-phone",
        placeHolder: "Change your number",
        data: data[0].phone,
      },
      {
        type: "email",
        name: "email",
        className: "c-email",
        placeHolder: "Change your Email",
        data: data[0].email,
      },
    ];
    const route = "/change-details";
    setInputToast({
      state: true,
      route,
      inputs,
      type: "details",
      heading: "Change Your Details",
    });
  }

  function getTime() {
    var today = new Date();
    var curHr = today.getHours();

    if (curHr < 12) {
      return "morning";
    } else if (curHr < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  }



  function toggleList() {
    document.getElementsByClassName("more-list-1")[0].classList.toggle("view");
    document.getElementsByClassName("more-list-2")[0].classList.toggle("view");
  }

  return loading ? (
    <div className="loader">
      <ScaleLoader loading={loading} color="#2672ed" />
    </div>
  ) : (
    <div className="m-dashboard-container">
      <section className="dashboard-nav">
        <img src={avatar} alt=""></img>
        <span>
          <h1>
            Good {getTime()}, {localStorage.getItem("name")}
          </h1>
          <p>Here's an overview of your data</p>
        </span>
        <div className="more-options">
          <div>
            <IoReceipt onClick={()=>nav("/billing")} className="more-btn" style={{marginRight:"10px"}} />
            <FaUserEdit onClick={toggleList} className="more-btn" />
          </div>
          <div onClick={editpersonal} className="more-list-1">
            <p>Change details</p>{" "}
            <IoPersonAdd className="more-btn" width="50px" />
          </div>
          <div onClick={editpassword} className="more-list-2">
            <p>Change Password</p>
            <CgPassword className="more-btn" width="50px" />
          </div>
        </div>
      </section>

      <section className="records">
        <div className="card-container">

            {data &&  
            <Card 
            title={"Days left"}
            count={data[0].daysLeft}
            data={[data[0].totalDays,data[0].daysPassed]}
            label={["Total Days","Days passed"]}
            n={99}
            />}

          {data &&
            data[1].map((data, index) => {
              return (
                <Card
                  key={index}
                  title={data.name}
                  count={data.count}
                  data={data.data}
                  label={data.label}
                  n={index}
                />
              );
            })}
        </div>
      </section>

      <section className="amount">
        {data && 
        
        data[2].map((data,index)=>{
          return(
            <BarChart 
            key={index}
            data={data.data}
            label={data.label}
            name={data.name}
            n={index}
            />
          )
        })
        }
      </section>
      {toast.state ? (
        <BoxToast
          type={toast.type}
          message={toast.message}
          btntext={toast.btntext}
          close={setToast}
          cb={toast.cb}
        />
      ) : (
        ""
      )}
      {inputToast.state ? (
        <InputToast
          route={inputToast.route}
          inputs={inputToast.inputs}
          type={inputToast.type}
          heading={inputToast.heading}
          close={setInputToast}
          setToast={setToast}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Dashboard;
