import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const CounsellorNotInterested = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [followUpData, setFollowUpData] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [allCampaign, setAllCampaign] = useState([])
  const [from, setFrom] = useState("")
  const [visitData, setVisitData] = useState([])
  const [currentDate, setCurrentDate]  = useState([])
  const [leadData, setLeadData] = useState([])
  const [counsellor, setCounsellor] = useState({
    name:"",
    counsellorNo:""
  })
  const [campaign, setCampaign] = useState({
    name:"",
    id:""
  })
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })
  const [demoData, setDemoData] = useState({
    date:"",
    demoStudent:[],
    month:"",
    day:"",
    year:"",
  })

  const [inpval, setINP] = useState({
    Course: "",
    Count:"",
    Day: "",
    date: "",
    endDate:"",
    Course: "",
    subCourse: "",
    Counselor: "",
    counselorNo: "",
    month: "",
    year: "",
    totalCount:0,
    Leadby:[],
    leadfrom:"",
    sttaus:"",
  });


  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    console.log('context value =',ContextValue)

    let tempDate = formatDate(new Date())

    console.log("today date =",tempDate)

    let tempRangeDate = rangeDate;

    tempRangeDate.startDate = tempDate;
    tempRangeDate.endDate = tempDate

    getAllCounsellor()
    // getLatestData()
    // getLead()

    let todayDate = formatDate(new Date())

    getLeadFilter()



    console.log("today date =",todayDate)
    setCurrentDate(todayDate)

  },[])

  const addDemo = (element, index, value)=>{

    console.log(' index of student and student=',index)
    Swal.fire({
        title: 'Add Reschedule Date',
        html:
            `<input id="demoDate" type="date" class="swal2-input" placeholder="Add Date">
            <input id="trainer" type="text" class="swal2-input" placeholder="Add Trainer">`,
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) 
          {
  
          console.log('result =')

          const demoDate = document.getElementById('demoDate').value;
          const trainer = document.getElementById('trainer').value;
  
          let tempDemoData = demoData;
  
          console.log('element time =',element.assignedDate,element,tempDemoData)
          tempDemoData.date = element.assignedDate;
  
          let obj = {}
  
          element.students.map(data=>{
            
            obj[data.name] = data.values
  
          })
  
          obj.trainer=trainer
          obj.status="Schedule"
          obj.demoStatus=""
          obj.reschedule=demoDate
          obj.scheduleDate=currentDate  
          obj.id = element.id      
  
          tempDemoData.demoStudent.push(obj)
          console.log("temp demo data =",tempDemoData,element.students)
          setDemoData(tempDemoData)
  
          let tempLeadData = latestData;
          tempLeadData[index].status = value
          setLeadData(tempLeadData)
  
          console.log("temp demo student =",tempDemoData,tempLeadData)
  
          Swal.fire({
            title: `${result.value}`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }

  const setFromTime =(fromTime)=>
    {
    // const startDateStr =  formatDate(new Date(fromTime))
    setRangeDate({...rangeDate, ["startDate"]:fromTime})
    // console.log("from time ",startDateStr)
    
   }

   const getLeadFilter = async () => {

    setLatestData([])

    console.log("rangeDate =",rangeDate)
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getCounsellorRingingConnectedRegistered', {
        method: 'GET',
        headers: {
          'counselorNo': localStorage.getItem("counsellorNo"),
          'campaignId': campaign.id,
          'startDate': rangeDate.startDate,
          'endDate': rangeDate.endDate,
          'from':from,
          'status':"Not Interested"
        }
      });
  
      totalLead = await totalLead.json();
      console.log("Lead count =", totalLead);
      setLatestData(totalLead.totalLead)
  
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

   const setToTime =(toTime)=>{
    // const endDateStr = formatDate(new Date(toTime))
    setRangeDate({...rangeDate, ["endDate"]:toTime})
    // console.log("to time ",endDateStr)
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
    // endDate.setDate(endDate.getDate() + 1);
  
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    console.log("start date and end date =", startDateStr, endDateStr);
    setRangeDate({...rangeDate, ["startDate"]: startDateStr, ["endDate"]: endDateStr});
  
    return { startDate: startDateStr, endDate: endDateStr };
};

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();

    setAllCounsellor(allCounselor.counselorData)
  }

  const getLatestData = async()=>
    {
    let leadData = await ContextValue.getLatestData()

    setLatestData(leadData)
    

    console.log("lead data =",leadData)
  }

  const setAssignedCounsellor = (index)=>
    {

      var selectElement = document.getElementsByClassName("assigned-counsellor-class");

      // let tempArr = tempObj[allCounsellor[selectElement[index].selectedIndex].counselorNo]

      let counsellorIndex = selectElement[index].selectedIndex
      let dataIndex = index

    console.log("value =",selectElement[index].selectedIndex,index)

    let tempCounsellorNotInterested = latestData

    tempCounsellorNotInterested[dataIndex].counsellorNo = allCounsellor[counsellorIndex].counselorNo;
    tempCounsellorNotInterested[dataIndex].counsellorName = allCounsellor[counsellorIndex].Name

    setLatestData(tempCounsellorNotInterested)


  }


  const addLead = async (e) => {

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


    console.log("timestamp",latestData[0].assignedDate)
    const timestamp = latestData[0].assignedDate;
    const date = timestamp.split('T')[0];
  


    try {

      let url = `https://counsellorlead-2.onrender.com/counselorLead`
      ContextValue.updateProgress(60);

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("counsellor")
        },
        body: JSON.stringify(latestData),
      });

      ContextValue.updateProgress(60);

      // const data = await res.json();

      console.log("progress bar 100")

      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // SuccessMsg();


    } 
    catch(error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Something went wrong!",
      // });

      console.log("error =", error.message);
    }
}


const formatDate = (date) => {
const day = String(date.getDate()).padStart(2, '0');
const month = String(parseInt(date.getMonth()) + 1).padStart(2,'0')
const year = date.getFullYear();

return (`${year}-${month}-${day}`)
};


const addLeadStatus = async (e) => {

  console.log("lead status route working")

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

  let tempLeadData = leadData;

  let tempAllLeadData = latestData;

  console.log("from route =",tempAllLeadData)

  try 
  {
    let url = `https://counsellorlead-2.onrender.com/counselorLead`
    ContextValue.updateProgress(60);

    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("counsellor")
      },
      body: JSON.stringify(tempAllLeadData),
    });

    ContextValue.updateProgress(60);

    const data = await res.json();

    if(data.status && demoData.length>0){

      try {

        let url = `https://counsellorlead-2.onrender.com/counselorDemo`
        ContextValue.updateProgress(60);
  
        const res = await fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("counsellor")
          },
          body: JSON.stringify(demoData),
        });
  
        ContextValue.updateProgress(60);
  
        const data = await res.json();
  
        if(data.status && (visitData.length>0 || followUpData>0)){
          try {
  
            let url = `https://counsellorlead-2.onrender.com/counselorVisit`
            ContextValue.updateProgress(60);
      
            const res = await fetch(`${url}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("counsellor")
              },
              body: JSON.stringify(visitData),
            });
      
            ContextValue.updateProgress(60);
      
            const data = await res.json();
      
            console.log("progress bar 100")
  
            if(data.status && followUpData.length>0){
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
          
                const data = await res.json();
          
                console.log("progress bar 100")
  
                if(data.status){
                  ContextValue.updateProgress(100);
                  ContextValue.updateBarStatus(false);
                  SuccessMsg("Visit");
                }
  
                else{
                  ContextValue.updateProgress(100);
                  ContextValue.updateBarStatus(false);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                  });
            
                }
          
               
          
          
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
            }
  
            else if(data.status && followUpData.length<=0){
              ContextValue.updateProgress(100);
              ContextValue.updateBarStatus(false);
              SuccessMsg("Visit");
            }
  
            else if(data.status == false){
              ContextValue.updateProgress(100);
            ContextValue.updateBarStatus(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            }
      
         
      
      
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
        }
  
        else if(data.status){
          ContextValue.updateProgress(100);
          ContextValue.updateBarStatus(true);
        }
  
        else if(data.status==false){
          ContextValue.updateProgress(100);
          ContextValue.updateBarStatus(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        } 
  
        console.log("progress bar 100", data)
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

    }

    else{
      ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
    }

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



};


const SuccessMsg=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: ``,
    showConfirmButton: false,
    timer: 1500
  })
  
}

const getLead = async()=>{

  console.log("new date =",new Date().getDate())

  let todayDate = formatDate(new Date())

  ContextValue.updateProgress(20);
  ContextValue.updateBarStatus(true);

  // console.log("rangeDate =",rangeDate,todayDate)

  // console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)

  try
  {
    let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorLeadCount',{
      method:'GET',
      headers:{
        "counselorNo":localStorage.getItem("counsellorNo"),
        "startDate":todayDate,
        "endDate":todayDate
      }
    })
    ContextValue.updateProgress(60);
    totalLead = await totalLead.json();
    
    // setTotalLead(totalLead.totalLead)
    // setLeadCount(totalLead.totalCount)
    console.log("lead count =",totalLead);
    setLatestData(totalLead.totalLead);
    if(totalLead.totalDemo!=null){
      setDemoData(totalLead.totalDemo)
    }
    
    setVisitData(totalLead.totalVisit)
    setFollowUpData(totalLead.totalFollowUp)
    ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
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

    const addVisit = (element, index, value)=>{

        console.log(' index of student =',index, visitData)
        Swal.fire({
            title: 'Add Visit Date',
            html:
                `<input id="visitDate" type="date" class="swal2-input" placeholder="Add Date">`,
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Add',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
      
              const visitDate = document.getElementById('visitDate').value;
      
              console.log("date =",currentDate, inpval)
              
              let tempVisitData = visitData;
      
              let objNew = {}
              let obj ={}
      
              element.students.map(data=>{
                
                objNew[data.name] = data.values
      
              })
            
                obj.students = objNew
                obj.date = element.assignedDate
                obj.visitTrainer = ""
                obj.visitCounsellor = ""
                obj.visitDate = visitDate
                obj.visitStatus = "Schedule"
                obj.id = element.id
             
      
              tempVisitData.push(obj)
              setVisitData(tempVisitData)
      
              let tempLeadData = latestData;
              tempLeadData[index].status=value
              setLeadData(tempLeadData)
      
              console.log("tempVisitData =",tempVisitData, tempLeadData)
      
              Swal.fire({
                title: `${result.value}`,
                
                imageUrl: result.value.avatar_url
              })
            }
          })
      
      }

      const addFollowUp = (element, index, value)=>{

        console.log(' index of student =',index)
        Swal.fire({
            title: 'Add Reschedule Date',
            html:
                `<input id="followUpDate" type="date" class="swal2-input" placeholder="Add Follow Up Date">
                <input id="remark" type="text" class="swal2-input" placeholder="Add Remark">`,
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Add',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
      
              const followUpDate = document.getElementById('followUpDate').value;
              const remark = document.getElementById('remark').value;
              
      
              let tempFollowUpData = followUpData;
      
              let obj = {}
              let objNew = {}
      
              element.students.map(data=>{
                
                objNew[data.name] = data.values
      
              })
      
                obj.students = objNew
                obj.status="Schedule"
                obj.FollowUp=[{
                  date:followUpDate,
                  remark:remark
                }]
                obj.lastFollowUpDate=followUpDate
                obj.status="Schedule"
                obj.date=element.assignedDate
                obj.id=element.id
             
      
              tempFollowUpData.push(obj)
              setFollowUpData(tempFollowUpData)
      
              let tempLeadData = latestData;
              tempLeadData[index].status=value
              setLeadData(tempLeadData)
      
      
              console.log("temp demo student =",tempFollowUpData, tempLeadData)
      
              Swal.fire({
                title: `${result.value}`,
                
                imageUrl: result.value.avatar_url
              })
            }
          })
      }

      const addStatus  =(value,element,index)=>{

        console.log('value and index status =',value,element)
      
        if(latestData[index].status=="")
        {
        if(value=="Demo"){
          addDemo(element,index, value)
        }
        else if(value=="Visit"){
          addVisit(element, index, value)
        }
        else if(value=="Follow Up"){
          addFollowUp(element, index, value)
        }
        else{
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          setLatestData(tempLatestData)
        }
      }
      
      else if(latestData[index].status!=value)
        {
        if(latestData[index].status=="Demo")
          {
          let tempDemoData = demoData;
          let tempDemoStudent = tempDemoData.filter(data=>{
            console.log("data from demo =",data)
              return (!(data.demoStudent.id==element.id))
          })
      
          tempDemoData.demoStudent  = tempDemoStudent;
          setDemoData(tempDemoData)
        }
        else if(latestData[index].status=="Visit"){
          let tempVisitData = visitData.filter(data=>{
              return (!(data.id==element.id))
          })
      
          console.log("temp visit data =",tempVisitData)
      
          setVisitData(tempVisitData)
        }
        else if(latestData[index].status=="Follow Up"){
          console.log("follow up status = ",followUpData)
          let tempFollowUpData = followUpData.filter(data=>{
            console.log("data id =",data.id,element.id)
              return (!(data.id==element.id))
          })
      
          setFollowUpData(tempFollowUpData)
        }
      
        if(value=="Demo"){
          addDemo(element,index, value)
        }
        else if(value=="Visit"){
          addVisit(element, index, value)
        }
        else if(value=="Follow Up"){
          addFollowUp(element, index, value)
        }

        else{
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          setLatestData(tempLatestData)
        }
      }
      
      }

      const setRemarks =(value,index)=>{

        console.log("remarks value =",value,index)
        let tempLatestData = latestData;

        tempLatestData[index].remarks = value
        setLatestData(tempLatestData)

        console.log("tempLatestData =",tempLatestData)

      }

      const setCampaignDetail =(value)=>{

        let tempCampaign = campaign;
        tempCampaign.name = allCampaign[value].name
        tempCampaign.id = allCampaign[value].id
    
        setCampaign(tempCampaign)
        console.log("value of campaign =",tempCampaign)
    
      }
      const setCounsellorDetail =(value)=>{
    
    
        let tempCounsellor = counsellor;
        tempCounsellor.name = allCounsellor[value].Name
        tempCounsellor.counsellorNo = allCounsellor[value].counselorNo
    
        setCounsellor(tempCounsellor)
        console.log("value of counsellor =",tempCounsellor)
    
      }


 return(
    <div>
            <h3>Not Interested - {latestData.length}</h3>
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
{/* 
                    { allCampaign.length>0 &&  
                    <select className='filter-btn'
                    onChange={e=>{setCampaignDetail(e.target.value)}}>
          <option selected disabled>select campaign</option>
          {
            allCampaign.map((data,index)=>{
              return(
                <option value={index}>{data.name}</option>
              )
            })
          }
        </select>} */}
      {/* {allCounsellor.length>0 &&  <select className='filter-btn'
      onChange={e=>{setCounsellorDetail(e.target.value)}}>
          <option selected disabled>select Counsellor</option>
        {
          allCounsellor.map((data,index)=>{
                return(
                  <option value={index}>{data.Name}</option>
                )
          })
        }
        </select>} */}

       
       
       <button onClick={getLeadFilter}>Search</button>
        </div>
            <button onClick={addLeadStatus}>Add Status</button>      
          {latestData.length>0 &&
            <table>

            <tr>
              <th>Campaign</th>
              <th>Assigned Date</th>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>


          <th>Status</th>
              <th>Remarks</th>
            </tr>

              {latestData.map((element,index)=>{
        return(
          <tr>
  <td>{latestData[index].campaignName}</td>
  <td>{latestData[index].assignedDate}</td>
  {
 
    element.students.map(data => {
      if (data.name === "full_name") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data.values}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
    element.students.map(data => {
      if (data.name === "city") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data.values}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
    element.students.map(data => {
      if (data.name === "phone_number") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data.values}
          </td>
        );
      }
      return null; // Return null if no match, to avoid errors
    })
    
  }
  {
 
    element.students.map((data,dataIndex) => {
      if (data.name === "email") {
        return (
          <td key={data.id}> {/* Replace `data.id` with a unique key */}
            {data.values}
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
                        onChange={(e)=>{
                          addStatus(e.target.value,element,index)
                        }}
                        defaultValue={element.status?element.status:"selected"}                     
                    >
                        <option disabled selected value="selected">--select Status--</option>
                    
                                <option value="Demo">Demo</option>
                                <option value="Visit">Visit</option>
                                <option value="Follow Up">Follow Up</option>                     
                                <option value="Ringing">Ringing</option>                     
                                <option value="Connected">Connected</option>                     
                                <option value="Registered">Registered</option>                                         
                        
                    </select>
    </td>
  }
  <td onChange={e=>setRemarks(e.target.value,index)}><input defaultValue={element.remarks}/></td>
</tr>

        )
      })}
          </table>
}        </div>
 )
};

export default CounsellorNotInterested;
