const pool = require("../models/db")

async function updateData(req,res){
    try {
        const className = req.body.className;
        const dataID = req.body.id;
        const files = req.files;
        let query;
        let values;
        let images = [];
        if (className === "issue") {
          query =
            "UPDATE ISSUE SET para_no = $1 , issue_no = $2 ,issuetype = $3,issuecategory = $4,issuesubcategory = $5,issuestatus = $6,amount = $7 WHERE id=$8";
          values = Object.values(req.body);
          values.shift();
          values.pop();
          values.pop();
          values.pop();
          values.pop();
          values.push(dataID);
        } else if (className === "action") {
          console.log(req.body);
          query =
            "UPDATE ACTION SET parano=$1,issueno=$2,proceedingnumber=$3,proceedingdate=$4,totalamount=$5,amountrecovered_sgs=$6,amountrecovered_hlc=$7,basedondocument=$8,tokenrecovery=$9,dateofhlc=$10 WHERE id=$11";
          if(req.body.amountrecovered_sgs===""){
            req.body.amountRecovered_sgs=0;
          }
          if(req.body.amountRecovered_hlc===""){
            req.body.amountRecovered_hlc=0;
          }
          if(req.body.basedondocument===""){
            req.body.basedondocument=0;
          }
          if(req.body.tokenrecovery===""){
            req.body.tokenrecovery=0;
          }
          values = Object.values(req.body);
          values.shift();
          values.splice(2, 1);
          values.pop();
          values.splice(9, 2);
          values.push(dataID);
        } else if (className === "vprp") {
          query =
            "UPDATE vprp SET name=$1, secondname=$2, gender=$3, religion=$4, community=$5, education=$6, jobcardno=$7, address=$8, email=$9, mobile=$10, bankname=$11, accountnumber=$12, ifsc=$13, pan=$14, status=$15, nativepanchayat=$16, block=$17, district=$18 WHERE id=$19";
          values = Object.values(req.body);
          values.pop();
        } else if (className === "basic") {
          query =
            "UPDATE basic_information SET nickname=$1, state=$2, district=$3, block=$4, panchayat=$5, startDate=$6, endDate=$7, GSDate=$8, expenditureyear=$9, auditedyear=$10, roundnumber=$11, SAPFromDate=$12, SAPtoDate=$13, UWRGbyIA=$14, SWRGbyIA=$15, MRGbyIA=$16, TRGbyIA=$17 , " +
            "numberOfWorks=$18 ,worksVerified=$19 ,houseHoldsWorked=$20 ,houseHoldsVerified=$21 ,noOfpeopleinGS=$22 ,noofdaysworked=$23 ,perdaywages=$24 ,honorariumExpenses=$25 ,travelExpenses=$26 ,p_p_b_Expenses=$27 ,videoExpenses=$28,otherExpenses=$29,totalExpenses=$30,vrpIDs=$31,images=$32 " +
            "WHERE id=$33";
          values = Object.values(req.body);
          images = values.pop().split(",");
          values.pop();
          values.pop();
          files.forEach((data) => {
            images.push(data.path);
          });
          ids = values.pop();
          if (ids == null || ids === "") {
            ids = [];
          } else {
            ids = ids.split(",");
          }
          values.push(ids);
          values.push(images);
          values.push(dataID);
        }
    
        if(query){
          const result = await pool.query(query,values);
        }
    
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
      }
}

async function deleteData(req,res){
    try {
        const className = req.body.className;
        const id = req.body.id;
        let query;
        let values = [id];
        if (className === "issue") {
          query = "DELETE FROM issue WHERE id=$1";
        } else if (className === "action") {
          query = "DELETE FROM action WHERE id=$1";
        } else if (className === "vprp") {
          query = "DELETE FROM vprp WHERE id=$1";
        } else if (className === "basic") {
          query = "DELETE FROM action WHERE basicID=$1";
          await pool.query(query, values);
          query = "DELETE FROM issue WHERE basicID=$1";
          await pool.query(query, values);
          query = "DELETE FROM basic_information WHERE id=$1";
        }
        const result = await pool.query(query, values);
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
      }
}

module.exports = {updateData,deleteData}; 