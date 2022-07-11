import {
  fetchActionInfo,
} from "../../../functions/requestAndResponses";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { useState} from "react";
import { actionInfo } from "../../../data/toolsData";
import Input from "../../InputComponents/Input";
import { useNavigate } from "react-router-dom";

function ActionInput({ setLoading, basic, setToast }) {

  function addAction(e) {
    e.preventDefault();
    setCount((pre) => [...pre, 1]);
  }

  function removeAction(e) {
    e.preventDefault();
    if (count.length > 1) {
      count.pop();
      const arr = [...count];
      setCount(arr);
    }
  }

  const [count, setCount] = useState([1]);
  const nav =  useNavigate();
  return (
    <div className="m-action-add-container">
      <form
        id="m-action-form"
        onSubmit={(e) => {
          fetchActionInfo(nav,e, setLoading, count.length, basic, setToast);
        }}
      >
        <div className="m-inputs-overlay">
          <h3>Select the Basic Information for the action </h3>
          <div className="m-action-inputs">
            <span className="m-input-container">
              <label>Basic Info:</label>
              <select
                required
                name="basicID"
              >
                {basic.map((data, index) => {
                  return (
                    <option key={index} value={data.id}>
                      {data.nickname}
                    </option>
                  );
                })}
              </select>
            </span>
            <span className="addActionbtns">
              <button type="button" onClick={addAction}>
                <IoAddCircle />
              </button>
              <button type="button" onClick={removeAction}>
                <IoRemoveCircle />
              </button>
            </span>
          </div>
        </div>

        {count.map((data, i) => {
          return (
            <div className="m-inputs-overlay">
              <h3>Action Taken</h3>
              <div className="m-action-inputs">

                {actionInfo.map((data, index) => {
                  return (
                    <Input
                      key={index}
                      k={data.k + "" + i}
                      name={data.name}
                      type={data.type}
                      values={data.values}
                      required={data.required}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        <button type="submit" className="m-action-submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ActionInput;
