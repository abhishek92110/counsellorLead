import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const CounsellorDemo = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [demoCount, setDemoCount] = useState(0)
  const [totaldemo,setTotalDemo] = useState([])
  const [trainer, setTrainer] = useState()
  const [reScheduleStudentData, setReScheduleStudent] = useState([])
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })
  const [campaign, setCampaign] = useState({
    name:"",
    id:""
  })

  let ContextValue = useContext(DataContext);
  // console.log('context value before=',ContextValue)

  useEffect(()=>{

    // console.log('context value =',ContextValue)

    getAllCounsellor()
    getDemo()
    getAllTrainer()

  },[])


  const [inpval, setINP] = useState({
    Course: "",
    Count:"",
    Day: "",
    date: "",
    Course: "",
    subCourse: "",
    Counselor: "",
    counselorNo: "",
    month: "",
    year: "",
    totalCount:0,
    demoStudent:[],
    name:"",
    mobile:"",
    trainer:"",
    status:"",
    reSchedule:""
  });

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();

    setAllCounsellor(allCounselor.counselorData)
  }

  const getAllTrainer = async()=>{

    let allTrainer = await ContextValue.getTrainer();

    console.log("allTrainer.trainerData", allTrainer.trainerData, allTrainer )

    setTrainer(allTrainer.trainerData)
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

  

  const getDemo = async()=>{
    setTotalDemo([])
    ContextValue.updateProgress(40);
    console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)

    let todayDate = formatDate(new Date())

    try{
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorDemoCount',{
        method:'GET',
        headers:{
          "counselorNo":localStorage.getItem("counsellorNo"),
          "startDate":todayDate,
          "endDate":todayDate
        }
      })
  
      totalLead = await totalLead.json();
      setTotalDemo(totalLead.totalLead)
      setDemoCount(totalLead.totalCount)

      ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);

      console.log("demo count  =",totalLead);
    }
      catch(error)
      {
        ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }

  }

  const setDemoStatus = (value, index)=>
    {

    console.log("set demo status")
    let tempInpVal  = totaldemo;

    if(value!="Change Trainer"){
    
    console.log("set demo status part 2 =",tempInpVal)
    tempInpVal[index].status = value;

    }

    if(value=="Change Trainer"){
      addTrainers(index)
    }

    console.log("temp inval set demo status=",)
   

    if(value=="Demo")
      {
      addRescheduleDate(index, "fromAddedDemo")
    }

    if(value!="Demo")
      {

       tempInpVal[index].finalStatus=value;
       tempInpVal[index].finalStatusFrom="Demo";
       tempInpVal[index].finalDate = formatDate(new Date());
       console.log("today date =", formatDate(new Date()),tempInpVal);

    }

    setTotalDemo(tempInpVal)

  }


  const getDoneStatus = (index, from) => {
    console.log('index of student =', index);
    
    Swal.fire({
      title: 'Post Visit Details',
      html: `
        <select id="responseInput" class="swal2-input">
          <option value="" disabled selected>Select Demo Response</option>
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
        const responseInput = document.getElementById('responseInput').value;
        
        if (!responseInput) {
          Swal.showValidationMessage('Please enter all details');
          return false;
        }

        
        return {
          responseInput
        };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { responseInput } = result.value;

        if(from=="fromAddedDemo"){

        let tempInpVal = totaldemo[0];
        console.log("tempVisit data =",tempInpVal)
        tempInpVal[index].demoStatus = responseInput;

        setTotalDemo([tempInpVal])
      }

      else{
        let tempReScheduleData = reScheduleStudentData;
        console.log("tempVisit data =",tempReScheduleData)
        tempReScheduleData[index].demoStatus =responseInput;

        setReScheduleStudent(tempReScheduleData)
      }

        
        // Add logic to handle the rescheduled details
        console.log('Response:', responseInput);
        
        Swal.fire({
          title: 'Details Added',
          text: `Response: ${responseInput}`
        });
      }
    });
  };


  const addTrainers = (index,from)=>{

    const trainerOptions = trainer.map((data, i) => (
      `<option value="${i}">${data.name}</option>`
    )).join('');

    console.log(' index of student =',index)
    Swal.fire({
      title: 'select Trainer',
      html: `
        <select id="trainer" class="swal2-input">
          <option value="">Select Trainer</option>
          ${trainerOptions}
        </select>
      `,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
          const trainerIndex = document.getElementById('trainer').value;

          let trainerData = trainer[trainerIndex].name
          let trainerId = trainer[trainerIndex].trainerId

        console.log("from  if=",from, totaldemo)
            let tempInpVal = totaldemo;
            tempInpVal[index].finalStatus="";
            tempInpVal[index].trainer=trainerData;
            tempInpVal[index].trainerId=trainerId;
            tempInpVal[index].finalStatusFrom="";
            tempInpVal[index].finalDate="";
            console.log("demo data =",tempInpVal);
            setTotalDemo(tempInpVal);

            // addNewSubCourse(courseName,courseCode,mainCourse)
          Swal.fire({
            title: `${result.value}`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }


  const addRescheduleDate = (index,from)=>{

    console.log(' index of student =',index)
    Swal.fire({
        title: 'Add Reschedule Date',
        html:
            '<input id="rescheduleDate" type="date" class="swal2-input" placeholder="Add Date">',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

          const rescheduleDate = document.getElementById('rescheduleDate').value;

        console.log("from  if=",from, totaldemo)
            let tempInpVal = totaldemo;
            tempInpVal[index].reschedule = rescheduleDate;
            tempInpVal[index].finalStatus="";
            tempInpVal[index].finalStatusFrom="";
            tempInpVal[index].finalDate="";
            console.log("demo data =",tempInpVal);
            setTotalDemo(tempInpVal);

            // addNewSubCourse(courseName,courseCode,mainCourse)
          Swal.fire({
            title: `${result.value}`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }

  const dateConvert = (selectedDate) => {
    const originalDate = new Date(selectedDate);
    const formattedDate = originalDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return formattedDate;
  };

  const addinpdataMail = async (e) => {

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    e.preventDefault();

   try {

      let url = `https://counsellorlead-2.onrender.com/counselorDemo`
      ContextValue.updateProgress(20);

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("counsellor"),
          "status":"fromDemo"
        },
        body: JSON.stringify(totaldemo),
      });

      ContextValue.updateProgress(60);

      const data = await res.json();

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);

      console.log("progress bar 100", res.status)

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

    setTotalDemo([])

    console.log("rangeDate =",rangeDate)
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorDemoCount', {
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
      setTotalDemo(totalLead.totalLead)
  
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
            <h3>Demo - {totaldemo.length}</h3>
            
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
                            onClick={addinpdataMail}
                            className="btn btn-primary"            
                            // disabled={allFieldStatus===false?true:false}
                          >
                            Submit Demo
                          </button>
      
        {totaldemo.length>0 &&
            <table>

            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>


          <th>Status</th>
          <th>Trainer</th>
            </tr>

              {totaldemo.map((element,index)=>{
        return(
          <tr>

  {/* <td>{totaldemo[index].campaignName}</td> */}
  {
 
    Object.keys(element.demoStudent).map((key) => {
        const data = element.demoStudent[key];

      if (key === "full_name") 
        {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
    Object.keys(element.demoStudent).map((key) => {
        const data = element.demoStudent[key];

      if (key === "city") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
    Object.keys(element.demoStudent).map((key) => {
        const data = element.demoStudent[key];

      if (key === "phone_number") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
 Object.keys(element.demoStudent).map((key) => {
  const data = element.demoStudent[key];

      if (key === "email") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
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
                    defaultValue={element.status!="Demo"?element.status:"selected"}
                    onChange={(e)=>{setDemoStatus(e.target.value,index)}}>
                      
                    <option disabled selected value="selected">--select Demo Status--</option>
                
                            <option value="Not Joined">Not Joined</option>                       
                            <option value="Not Interested">Not Interested</option>                       
                            <option value="Demo">Re Demo</option>                                         
                            <option value="Registered">Registered</option>                      
                            <option value="Change Trainer">Change Trainer</option>                      
                    
                </select>
     </td>
     
  }
  <td>{element.trainer}</td>
</tr>

        )
      })}
          </table>
}  

 </div>
 )
};

export default CounsellorDemo;
