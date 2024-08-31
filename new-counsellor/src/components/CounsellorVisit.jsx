import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const CounsellorVisit = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [totalVisit, setTotalVisit] = useState([])
  const [RevisitData, setRevisitData] = useState()
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

    console.log('context value =',ContextValue)

    getAllCounsellor()
    getVisit()

  },[])

  const getReVisitDate = (index, from)=>{

    console.log(' index of student =',index)
    Swal.fire({
        title: 'Add Revisit Date',
        html:
            '<input id="reVisitDate" type="date" class="swal2-input" placeholder="Add Date">',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

          const reVisitDate = document.getElementById('reVisitDate').value;          
    
            let tempVisitData = totalVisit;
            tempVisitData[index].visitDate = reVisitDate 
            tempVisitData[index].finalStatus="";
            tempVisitData[index].finalStatusFrom="";
            tempVisitData[index].finalDate="";
  
            setTotalVisit(tempVisitData)
           

            // addNewSubCourse(courseName,courseCode,mainCourse)
          Swal.fire({
            title: `Re Visit Date has been added`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }

  const getDoneStatus = (index, from) => {
    console.log('index of student =', index);
    
    Swal.fire({
      title: 'Post Visit Details',
      html: `
        <input id="trainerInput" type="text" class="swal2-input" placeholder="Visit Trainer">
        <input id="counselorSelect" type="text" class="swal2-input" placeholder="Visit Counsellor">
        <select id="responseInput" class="swal2-input">
          <option value="" disabled selected>Select Visit Response</option>
          <option value="Registered">Registered</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Not Interested">Not Interested</option>
        </select>
        
      `,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const trainerInput = document.getElementById('trainerInput').value;
        const counselorSelect = document.getElementById('counselorSelect').value;
        const responseInput = document.getElementById('responseInput').value;
        
        if (!trainerInput || !counselorSelect || !responseInput) {
          Swal.showValidationMessage('Please enter all details');
          return false;
        }

        
        return {
          trainerInput,
          counselorSelect,
          responseInput
        };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { trainerInput, counselorSelect, responseInput } = result.value;

        if(from=="from today visit"){
        let tempVisitData = totalVisit;
        console.log("tempVisit data =",tempVisitData, totalVisit)
        tempVisitData[index].visitCounsellor =counselorSelect;
        tempVisitData[index].visitTrainer =trainerInput;
        tempVisitData[index].visitResponse =responseInput;


        setTotalVisit(tempVisitData)
      }

      else{
        let tempReVisitData = RevisitData;
        console.log("tempVisit data =",tempReVisitData, RevisitData)
        tempReVisitData[index].visitCounsellor =counselorSelect;
        tempReVisitData[index].visitTrainer =trainerInput;
        tempReVisitData[index].visitResponse =responseInput;


        setRevisitData(tempReVisitData)
      }

        
        // Add logic to handle the rescheduled details
        console.log('Trainer:', trainerInput);
        console.log('Counselor:', counselorSelect);
        console.log('Response:', responseInput);
        
        Swal.fire({
          title: 'Details Added',
          text: `Trainer: ${trainerInput}, Counselor: ${counselorSelect}, Response: ${responseInput}`
        });
      }
    });
  };

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


  const getVisit = async()=>{
    ContextValue.updateProgress(40);
    console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)

    let todayDate = formatDate(new Date())

    try{
      let totalLead = await fetch('https://counsellorlead-1.onrender.com/getcounselorVisitCount',{
        method:'GET',
        headers:{
          "counselorNo":localStorage.getItem("counsellorNo"),
          "startDate":todayDate,
          "endDate":todayDate
        }
      })
  
      totalLead = await totalLead.json();
      console.log("total visit =",totalLead.totalLead)
      setTotalVisit(totalLead.totalLead)
      // setDemoCount(totalLead.totalCount)

      let totalReschedule = await fetch('https://counsellorlead-1.onrender.com/getcounselorDemoReschedule',{
        method:'GET',
        headers:{
          "counselorNo":localStorage.getItem("counsellorNo"),
          "startDate":rangeDate.startDate,
          "endDate":rangeDate.endDate
        }
      })

      totalReschedule = await totalReschedule.json();

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);

      console.log("demo count  =",totalLead, totalReschedule);
    }
      catch(error){
        ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);
        console.log("error from visit =",error.message)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }

  }

  const setVisitStatus =(name, value, index,from)=>{
    console.log("inside visit status", value)
   
    let tempvisitData = totalVisit;
    tempvisitData[index].visitStatus  = value;
    tempvisitData[index].visitDate  = "";
    tempvisitData[index].finalStatus=value;
    tempvisitData[index].finalStatusFrom="Follow Up";
    tempvisitData[index].finalDate=formatDate(new Date());
    console.log("today date =",formatDate(new Date()), tempvisitData)
    setTotalVisit(tempvisitData)
   

    if(value=="Visit")
    {
      console.log("inside if condition",value)
      getReVisitDate(index, from)
      
    }
      // else if(value!="Re Visit"){
      // console.log("inside else if condition",value)

      //   getDoneStatus(index, from)
      // }
  }

  const updateVisit = async (e) => {

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    e.preventDefault();
    // let tempInpVal = inpval;
    // console.log("lead date is  =",tempInpVal.date)
    // let dateArray = tempInpVal.date.split("-");
    // console.log("registration array =", dateArray);
    // tempInpVal.date = dateConvert(tempInpVal.date);
    // tempInpVal.month = dateArray[1];
    // tempInpVal.year = dateArray[0];
    // tempInpVal.Day = dateArray[2];

    // tempInpVal.date = `${tempInpVal.year}-${tempInpVal.month}-${tempInpVal.Day}`

    // console.log("register value =", tempInpVal);

    console.log("revist data =",totalVisit)


    try {

      let url = `https://counsellorlead-1.onrender.com/counselorVisit`
      ContextValue.updateProgress(60);

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("counsellor"),
          "status":"fromVisit"
        },
        body: JSON.stringify(totalVisit),
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

    setTotalVisit([])

    console.log("rangeDate =",rangeDate)
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-1.onrender.com/getcounselorVisitCount', {
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
      setTotalVisit(totalLead.totalLead)
  
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
            <h3>Visit - {totalVisit.length}</h3>
            
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
                            onClick={updateVisit}
                            className="btn btn-primary mt-2"            
                            // disabled={allFieldStatus===false?true:false}
                          >
                            Submit Visit
                          </button>
      
        {totalVisit.length>0 &&
            <table>

            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Visit Status</th>
            </tr>

              {totalVisit.map((element,index)=>{
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
                        name="leadfrom"
                        class="custom-select mr-sm-2"
                        defaultValue={element.visitStatus!="Visit"?element.visitStatus:"selected"}
                        onChange={(e)=>setVisitStatus(e.target.name, e.target.value, index, "from today visit")}
                      
                    >
                        <option disabled selected value="selected">--Select Visit Status--</option>
                    
                                <option value="Not Visited" >Not Visited</option>                       
                                <option value="Not Interested" >Not Interested</option>                       
                                <option value="Visit" >Re Visit</option>                      
                                <option value="Registered">Registered</option>                      
                        
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

export default CounsellorVisit;
