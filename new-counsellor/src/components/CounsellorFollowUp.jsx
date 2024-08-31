import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const CounsellorFollowUp = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [followUpData, setFollowUpData] = useState([])
  const [reFollowUp, setReFollowUp]  = useState()
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })
  const [campaign, setCampaign] = useState({
    name:"",
    id:""
  })

  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    let tempDate = formatDate(new Date())

    console.log("today date =",tempDate)

    let tempRangeDate = rangeDate;

    tempRangeDate.startDate = tempDate;
    tempRangeDate.endDate = tempDate

    setRangeDate(tempRangeDate)

    console.log('context value =',ContextValue)

    getAllCounsellor()
    getFollowUp()
    getLeadFilter()

  },[])

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();

    setAllCounsellor(allCounselor.counselorData)
  }

  const setFromTime =(fromTime)=>{
    // const startDateStr =  formatDate(new Date(fromTime))
    setRangeDate({...rangeDate, ["startDate"]:fromTime})
    // console.log("from time ",startDateStr)
    
   }
   const setToTime =(toTime)=>{
    // const endDateStr = formatDate(new Date(toTime))
    setRangeDate({...rangeDate, ["endDate"]:toTime})
    // console.log("to time ",endDateStr)
   }


  const setAssignedCounsellor = ()=>{

  }

  const setStartEndate = (timeValue) => {
    console.log("start and end date =", timeValue);
    let today = new Date();
    let startDate, endDate;
  
    if (timeValue === "Today") {
        startDate = today;
        endDate = new Date(today);
    } else if (timeValue === "Yesterday") {
        today.setDate(today.getDate() - 1); // Subtract 1 day to get yesterday
        startDate = today;
        endDate = new Date(today);
    } else if (timeValue === "Last Week") {
        endDate = new Date(); // Current date
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7); // Subtract 7 days to get a week ago
    } else {
        // Handle the case when time is not recognized
        console.error("Invalid time option");
        return;
    }
  
    // Add one day to endDate
  
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    console.log("start date and end date =", startDateStr, endDateStr);
    setRangeDate({...rangeDate, ["startDate"]: startDateStr, ["endDate"]: endDateStr});
  
    return { startDate: startDateStr, endDate: endDateStr };
};

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
const month = String(parseInt(date.getMonth()) + 1).padStart(2,'0')
const year = date.getFullYear();

return (`${year}-${month}-${day}`)
  };


  const getFollowUp = async()=>{
    console.log("get follow up")

    let todayDate = formatDate(new Date())

    console.log("today date =",todayDate)

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    // console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)

    try{
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorFollowUpCount',{
        method:'GET',
        headers:{
          "counselorNo":localStorage.getItem("counsellorNo"),
          "startDate":todayDate,
          "endDate":todayDate
        }
      })

      ContextValue.updateProgress(60);

      totalLead = await totalLead.json();

      let totalReFollowUp = await fetch('https://counsellorlead-2.onrender.com/getcounselorReFollowUp',{
        method:'GET',
        headers:{
          "counselorNo":localStorage.getItem("counsellorNo"),
          "startDate":todayDate,
          "endDate":todayDate
        }
      })

      console.log("lead count =",totalReFollowUp.totalFollowUp,totalLead.totalCount);
      // setTotalVisitCount(totalLead.totalCount)
      setFollowUpData(totalLead.totalLead)
  
      totalReFollowUp = await totalReFollowUp.json();
      setReFollowUp(totalReFollowUp.totalFollowUp)

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // SuccessMsg();
    }
      catch(error){

        ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });

      }

  }

  const setfollowupStatus  =(index, value)=>{
    let tempFollowUp  = followUpData;
    tempFollowUp[index].status = value;
    tempFollowUp[index].finalStatus=value;
    tempFollowUp[index].finalStatusFrom="Follow Up";
    tempFollowUp[index].finalDate=formatDate(new Date());

    console.log("today date =",formatDate(new Date()),tempFollowUp)


    setFollowUpData(tempFollowUp)
  }

  const getReFollowUpDate = (index, from)=>{

    console.log(' index of student =',index)
    Swal.fire({
        title: 'Add Revisit Date',
        html:
            `<input id="reVisitDate" type="date" class="swal2-input" placeholder="Add Date">,
            <input id="remark" type="text" class="swal2-input" placeholder="Add Remarks">`,
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

          const reFollowUpDate = document.getElementById('reVisitDate').value;          
          const remark = document.getElementById('remark').value;      
          
           let tempfollowUpData =followUpData;
            tempfollowUpData[index].lastFollowUpDate = reFollowUpDate 
            tempfollowUpData[index].finalStatus="";
            tempfollowUpData[index].finalStatusFrom="";
            tempfollowUpData[index].finalDate="";
            tempfollowUpData[index].FollowUp.push({
              date:reFollowUpDate,
              remark:remark
            })

            console.log("temp visit data from re follow up date=",tempfollowUpData)
  
            setFollowUpData(tempfollowUpData)

            // addNewSubCourse(courseName,courseCode,mainCourse)
          Swal.fire({
            title: `Re Follow Up date has been added`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }

  const updateRefollowUp = async (e) => {

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    e.preventDefault();

    try {

      let url = `https://counsellorlead-2.onrender.com/counselorFollowUp`
      ContextValue.updateProgress(60);

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("counsellor"),
          "status":"fromFollowUp"
        },
        body: JSON.stringify(reFollowUp),
      });

      ContextValue.updateProgress(60);

      // const data = await res.json();

      console.log("progress bar 100")

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // SuccessMsg("Visit");


    } 
    catch(error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      console.log("error =", error.message);
    }
    

  };

  const updateFollowUp = async (e) => {

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    e.preventDefault();

    // console.log("register value =", tempInpVal);


    try {

      let url = `https://counsellorlead-2.onrender.com/counselorFollowUp`
      ContextValue.updateProgress(60);

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("counsellor")
        },
        body: JSON.stringify(followUpData),
      });

      ContextValue.updateProgress(60);

      // const data = await res.json();

      console.log("progress bar 100")

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // SuccessMsg("Visit");


    } 
    catch(error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      console.log("error =", error.message);
    }
    

  };

  const getLeadFilter = async () => {
    setFollowUpData([])

    console.log("rangeDate =",rangeDate)
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorFollowUpCount', {
        method: 'GET',
        headers: {
          'counselorNo': localStorage.getItem("counsellorNo"),
          'campaignId': campaign.id,
          'startDate': rangeDate.startDate,
          'endDate': rangeDate.endDate
        }
      });
  
      totalLead = await totalLead.json();
      console.log("Lead count =", totalLead);
      setFollowUpData(totalLead.totalLead)
  
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
  
    }
     catch (error) {
      console.log("Error fetching lead count =", error.message);
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Something went wrong!",
      // });
    }
  };

 return(
    <div>
            <h3>Follow Up - {followUpData.length}</h3>
            
          <div className='filter-section'>
<select
                        id="exampleInputPassword1"
                        type="select"
                        name="Course"
                        class="custom-select mr-sm-2 filter-btn"
                        onChange={e =>{ setTimeValue(e.target.value);setStartEndate(e.target.value)}}
                    >
                        <option disabled selected>--select Time--</option>
                    
                                <option value="Today">Today</option>
                                <option value="Yesterday">Yesterday</option>
                                <option value="Last Week">Last Week</option>
                                <option value="Select Range">Select Range</option>
                        
                        
                    </select>

                     {timeValue==="Select Range" && 
                     <>
                     <label>From</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setFromTime(e.target.value)}></input>
                      <label>To</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setToTime(e.target.value)}></input>
                      </>}

       
       
       <button onClick={getLeadFilter}>Search</button>
        </div>

        <button
                            type="submit"
                            onClick={updateFollowUp}
                            className="btn btn-primary"            
                            // disabled={allFieldStatus===false?true:false}
                          >
                            Submit Re Follow Up
                          </button>


        {followUpData.length>0 &&
            <table>

            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Follow Up Status</th>
            </tr>

              {followUpData.map((element,index)=>{
        return(
          <tr>
  {
 
 Object.keys(element.students).map((key) => {
     const data = element.students[key];

   if (key === "full_name") 
     {
     return (
       <td key={element.id}> {/* Replace `data.id` with a unique key */}
         {data}
       </td>
     );
   }
   return null; // Return null if no match, to avoid errors
 })
 
}
{

 Object.keys(element.students).map((key) => {
     const data = element.students[key];

   if (key === "city") {
     return (
       <td key={element.id}> {/* Replace `data.id` with a unique key */}
         {data}
       </td>
     );
   }
   return null; // Return null if no match, to avoid errors
 })
 
}
{

 Object.keys(element.students).map((key) => {
     const data = element.students[key];

   if (key === "phone_number") {
     return (
       <td key={element.id}> {/* Replace `data.id` with a unique key */}
         {data}
       </td>
     );
   }
   return null; // Return null if no match, to avoid errors
 })
 
}
{

Object.keys(element.students).map((key) => {
const data = element.students[key];

   if (key === "email") {
     return (
       <td key={element.id}> {/* Replace `data.id` with a unique key */}
         {data}
       </td>
     );
   }
   return null; // Return null if no match, to avoid errors
 })
 
}
  {allCounsellor.length > 0 &&
    <td>
        <select
                        id="exampleInputPassword1"
                        type="select"
                        name="status"
                        class="custom-select mr-sm-2"
                        defaultValue={element.status!="Follow Up"?element.status:"selected"}
                        onChange={(e)=>{setfollowupStatus(index,e.target.value);if (e.target.value === "Follow Up") {
                          getReFollowUpDate(index, "from follow up");
                        }
                      }}
                      
                    >
                        <option disabled selected value="selected">--Select Follow Up Status--</option>
                    
                                <option value="Registered">Registered</option>
                                <option value="Not Interested">Not Interested</option>                                            
                                <option value="Follow Up">Re Follow Up</option>                                            
                        
                    </select>
    </td>
  }
</tr>

        )
      })}
          </table>
}        


 </div>
 )
};

export default CounsellorFollowUp;
