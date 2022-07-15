import { basicInformation } from "../../../data/toolsData";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import Input from "../../InputComponents/Input";
import { useState, useEffect } from "react";
import storeImage from "../../../functions/imageFucntions";
import { fetchBasicInfo } from "../../../functions/requestAndResponses";
import { states, stateArray } from "../../../data/districtData";
import { motion } from "framer-motion";
import { deletedData } from "../../../functions/requestAndResponses";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete, MdArrowDropDownCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SearchableDropdown from "../../InputComponents/SearchableDropdown";

function BasicInput({ vprp, setLoading, edit, data, cb, n, setToast }) {
  const [images, setImages] = useState([]);
  const [vrpId, setvrpIds] = useState([]);
  const [basicState, setBasicState] = useState(0);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [vprpList,setVprpList]=useState([]);

  useEffect(() => {
    
    if (data) {
      populateForm();
    }
  }, []);

  async function populateForm() {
    for (var [key, value] of Object.entries(data)) {
      const element = await document.getElementById(key + n);
      if (element) {
        if (element.type === "date") {
          var date = await value.substring(0, 10);
          element.value = date;
        } else {
          element.value = value;
          if (element.name === "state") {
            setBasicState(stateArray.indexOf(value));
          }
        }
      }

      if (key === "vrpids") {
        for (var i = 0; i < value.length; i++) {
          for (var j = 0; j < vprp.length; j++) {
            if (value[i] === vprp[j].id) {
              let id = "vrpIDs" + (Math.random() * 1000).toString();
              setVprpList(vprpList.concat(<SearchableDropdown defaultValue={vprp[j].row} placeholder={"Enter mobile number to search"} data={vprp} name={id} />))
              setvrpIds((pre) => {
                return [...pre,id];
              });
              
            }
          }
        }
      }
    }

    if (edit) {
      makeFormEditable();
    } else {
      makeFormReadOnly();
    }
  }

  async function makeFormReadOnly() {
    const formID = `m-basic-form${n}`;
    const form = document.getElementById(formID);
    const elements = await form.elements;

    for (var i = 0, len = elements.length; i < len; ++i) {
      elements[i].readOnly = true;
    }
  }

  function makeFormEditable() {
    const elements = document.getElementById("m-basic-form").elements;

    for (var i = 0, len = elements.length; i < len; ++i) {
      elements[i].readOnly = false;
    }
  }

  function deleteEntry() {
    const obj = { className: "basic", id: data.id };
    deletedData("/delete-data", obj, setLoading, setToast);
  }

  function addImage(e) {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style = { display: "none" };
    input.required = true;
    input.name = "Image" + Math.floor(Math.random() * 100).toString();
    input.onchange = getImage;
    input.click();
  }

  function removeImages(e) {
    e.preventDefault();
    if (images.length > 0) {
      images.pop();
      const arr = [...images];
      setImages(arr);
    }
  }

  function getImage(e) {
    storeImage(e, setImages);
  }

  function addVrp(e) {
    let id = "vrpIDs" + (Math.random() * 1000).toString();
    setVprpList(vprpList.concat(<SearchableDropdown placeholder={"Enter mobile number to search"} data={vprp} name={id} />))
    setvrpIds((pre) => {
      return [...pre,id];
    });
    
  }

  async function removeVrp(e) {
    e.preventDefault();
    
    if(vprpList.length>=0){
      vrpId.pop();
      setvrpIds(vrpId)
      console.log(vprpList.pop());
      setVprpList(new Array(...vprpList))
    }

  }

  function getIDs(formData) {
    const selectedIds = [];
    let allFound = true;
    let name;
    vrpId.forEach((data, index) => {
      let value =  formData.get(String(data));
      let found = false;
      for(var i=0;i<vprp.length;i++){
        if(vprp[i].row===value){
          selectedIds.push(vprp[i].id);
          found=true;
          break;
        }
      }
      if(!found){
        allFound=false;
        name = value;
        return;
      }
      formData.delete(data);
    });
    formData.append("vrpIDs", selectedIds);
    return allFound?formData:name;

  }

  const variants = {
    open: { height: "auto" },
    close: { height: edit ? "auto" : "99px" },
  };
  return (
    <motion.div
      variants={variants}
      style={{ height: "99px" }}
      animate={open ? "open" : "close"}
      transition={{ duration: "0.5" }}
      className="m-basic-edit"
    >
      <form
        id={`m-basic-form${n}`}
        onSubmit={(e) => {
          if (data !== undefined)
            fetchBasicInfo(
              nav,
              e,
              setLoading,
              getIDs,
              images,
              setToast,
              edit,
              data.id,
              data.images
            );
          else fetchBasicInfo(nav,e, setLoading, getIDs, images, setToast);
        }}
        encType="multipart/formData"
      >
        <div className="m-inputs-overlay">
          <h3>{edit ? "Basic Information" : data.nickname}</h3>
          {!edit && (
            <div>
              <motion.button
                whileHover={{ scale: "1.2" }}
                whileTap={{ scale: "0.9" }}
                style={{ scale: "1" }}
                onClick={cb}
                name={n}
                className="btn"
              >
                <RiEdit2Fill size="25px" />
              </motion.button>
              <motion.button
                whileHover={{ scale: "1.2" }}
                whileTap={{ scale: "0.9" }}
                style={{ scale: "1" }}
                onClick={(e) => {
                  e.preventDefault();
                  setToast({
                    state: true,
                    type: "warning",
                    message: "Do you really want to delete this Entry ?",
                    btntext: "Yes",
                    cb: deleteEntry,
                  });
                }}
                name={n}
                className="btn"
              >
                <MdDelete size="25px" />
              </motion.button>
              <motion.button
                whileHover={{ scale: "1.2" }}
                whileTap={{ scale: "0.9" }}
                style={{ scale: "1" }}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen((pre) => !pre);
                }}
                name={n}
                className="btn"
              >
                <MdArrowDropDownCircle size="25px" />
              </motion.button>
            </div>
          )}

          <div className="m-basic-inputs">
            <Input
              k={`nickname${n}`}
              name="Enter a Nickname so that you can identify this info easily"
              type="text"
              required
            />
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Gram panchayat Name and Dates</h3>
          <div className="m-basic-inputs">
            <span className="m-input-container getDistrict">
              <label>State</label>
              <select
                name="state"
                id={`state${n}`}
                placeholder="Select State"
                onChange={(e) => {
                  setBasicState(e.target.selectedIndex);
                }}
              >
                {states.map((data, i) => (
                  <option key={i} value={data.state}>
                    {data.state}
                  </option>
                ))}
              </select>
            </span>
            <span className="m-input-container getDistrict">
              <label>District</label>
              <select
                placeholder="Select District"
                id={`district${n}`}
                name="district"
              >
                {states[basicState].districts.map((data, i) => (
                  <option key={i} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </span>

            {basicInformation[1].map((data, index) => {
              return (
                <Input
                  k={data.k + n}
                  key={index}
                  name={data.name}
                  type={data.type}
                  n={n}
                />
              );
            })}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Records Given for Social Audit</h3>
          <div className="m-basic-inputs">
            {basicInformation[2].map((data, index) => {
              return (
                <Input
                  k={data.k + n}
                  key={index}
                  name={data.name}
                  type={data.type}
                  required={data.required}
                  change={data.change}
                  n={n}
                />
              );
            })}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Social Audit Verification Information</h3>
          <div className="m-basic-inputs">
            {basicInformation[3].map((data, index) => {
              return (
                <Input
                  k={data.k + n}
                  key={index}
                  name={data.name}
                  type={data.type}
                  required={data.required}

                  n={n}
                />
              );
            })}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Social Audit Grama Sabha</h3>
          <div className="m-basic-inputs">
            {basicInformation[4].map((data, index) => {
              return (
                <Input
                  k={data.k + n}
                  key={index}
                  name={data.name}
                  type={data.type}
                  required={data.required}
                  change={data.change}
                  n={n}
                />
              );
            })}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Socia Audit Grama Sabha Images</h3>
          <div className="m-basic-inputs getImages">
            {edit && (
              <span>
                <button type="button" onClick={addImage}>
                  <IoAddCircle />
                </button>
                <button type="button" onClick={removeImages}>
                  <IoRemoveCircle />
                </button>
              </span>
            )}
            {data
              ? data.images.map((img, index) => {
                  return (
                    <div className="getImages-container">
                      <img key={index} src={img} alt="" />
                    </div>
                  );
                })
              : ""}
            {images.map((data, index) => {
              return (
                <div className="getImages-container">
                  <img key={index} src={URL.createObjectURL(data)} alt="" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Social Audit Resource Person who Facilated this audit (VPRP)</h3>
          <div className="m-basic-inputs getVrp">
            {!edit ? (
              <span id="add-vprp-view"></span>
            ) : (
              <span>
                <button type="button" onClick={addVrp}>
                  <IoAddCircle />
                </button>
                <button type="button" onClick={removeVrp}>
                  <IoRemoveCircle />
                </button>
              </span>
            )}
            {vprpList}
          </div>
        </div>
        <div className="m-inputs-overlay">
          <h3>Expenses for the facilitation of this Social Audit</h3>
          <div className="m-basic-inputs">
            {basicInformation[6].map((data, index) => {
              return (
                <Input
                  k={data.k + n}
                  key={index}
                  name={data.name}
                  type={data.type}
                  required={data.required}
                  change={data.change}
                  n={n}
                />
              );
            })}
          </div>
        </div>

        {edit && (
          <button type="submit" className="m-basic-submit">
            Submit
          </button>
        )}
      </form>
    </motion.div>
  );
}

export default BasicInput;
