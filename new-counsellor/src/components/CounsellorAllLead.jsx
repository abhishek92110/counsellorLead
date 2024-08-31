import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const CounsellorAllLead = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [followUpData, setFollowUpData] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [visitData, setVisitData] = useState([])
  const [allCampaign, setAllCampaign] = useState([])
  const [currentDate, setCurrentDate]  = useState([])
  const [leadData, setLeadData] = useState([])
  const [trainer, setTrainer] = useState()
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })

  const [campaign, setCampaign] = useState({
    name:"",
    id:""
  })
  const [demoData, setDemoData] = useState([])

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

    let tempDate = formatDate(new Date())

    console.log("today date =",tempDate)

    let tempRangeDate = rangeDate;

    tempRangeDate.startDate = tempDate;
    tempRangeDate.endDate = tempDate

    setRangeDate(tempRangeDate)

    console.log('context value =',ContextValue)

    getLead()
    // getAllCounsellor()
    // // getLatestData()
    // getAllTrainer()
    // getAllCampaign()
    getCounsellorCampaign()

    let todayDate = formatDate(new Date())

    console.log("today date =",todayDate)
    setCurrentDate(todayDate)

  },[])

  const getCounsellorCampaign = async()=>{
    await getAllCounsellor()
    
    await getAllTrainer()
    
    // ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);
    await getAllCampaign()
    // ContextValue.updateProgress(100);
    ContextValue.updateBarStatus(false);
  }

  const setCampaignDetail =(value)=>{

    let tempCampaign = campaign;
    tempCampaign.name = allCampaign[value].name
    tempCampaign.id = allCampaign[value].id

    setCampaign(tempCampaign)
    console.log("value of campaign =",tempCampaign)

  }

  const getAllCampaign = async()=>{

    let allCampaign = await ContextValue.getAllCampaign();

    console.log("all campaign =",allCampaign)

    setAllCampaign(allCampaign.data)
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

  // const addDemo = (element, index, value)=>{

  //   console.log(' index of student and student=',index)
  //   Swal.fire({
  //       title: 'Add Reschedule Date',
  //       html:
  //           `<input id="demoDate" type="date" class="swal2-input" placeholder="Add Date">
  //           <input id="trainer" type="text" class="swal2-input" placeholder="Add Trainer">`,
  //       inputAttributes: {
  //         autocapitalize: 'off'
  //       },
  //       showCancelButton: true,
  //       confirmButtonText: 'Add',
  //       showLoaderOnConfirm: true,
  //       allowOutsideClick: () => !Swal.isLoading()
  //     }).then((result) => {
  //       if (result.isConfirmed) 
  //         {
  
  //         console.log('result =')

  //         const demoDate = document.getElementById('demoDate').value;
  //         const trainer = document.getElementById('trainer').value;
  
  //         let tempDemoData = demoData;
  //         let templeadData = latestData

  //         templeadData[index].scheduleDate = demoDate
  //         templeadData[index].finalStatus = ""
  //         templeadData[index].finalStatusFrom = ""
  //         templeadData[index].finalDate = ""
  
  //         console.log('element time =',element.assignedDate,element,tempDemoData)
  //         let objNew = {}
  //         let obj ={}
    
  //             element.students.map(data=>{
                
  //               objNew[data.name] = data.values
      
  //             })
            
  //               obj.demoStudent = objNew
  //               obj.finalStatus = ""
  //               obj.finalStatusFrom = ""
  //               obj.finalDate = ""
  //               obj.date = element.assignedDate
  //               obj.status="Demo"
  //               obj.demoStatus=""
  //               obj.counselorNo=element.counsellorNo
  //               obj.campaignId = element.campaignId
  //               obj.campaignName = element.campaignName
  //               obj.id = element.id
  //               obj.reschedule=demoDate
  //               obj.scheduleDate=currentDate 
  //               obj.trainer=trainer
  
  //         tempDemoData.push(obj)
  //         console.log("temp demo data =",tempDemoData,element.students)
  //         setDemoData(tempDemoData)

  
  //         let tempLeadData = latestData;
  //         tempLeadData[index].status = value
  //         setLeadData(tempLeadData)
  
  //         console.log("temp demo student =",tempDemoData,tempLeadData)
  
  //         Swal.fire({
  //           title: `${result.value}`,
            
  //           imageUrl: result.value.avatar_url
  //         })
  //       }
  //     })
  // }

  const addDemo = (element, index, value) => {
    console.log('Index of student and student:', index);
  
    const trainerOptions = trainer.map((data, i) => (
      `<option value="${i}">${data.name}</option>`
    )).join('');
  
    Swal.fire({
      title: 'Add Reschedule Date',
      html: `
        <input id="demoDate" type="date" class="swal2-input" placeholder="Add Date">
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
        const demoDate = document.getElementById('demoDate').value;
        const trainerIndex = document.getElementById('trainer').value;

        const trainerName = trainer[trainerIndex].name
        const trainerId = trainer[trainerIndex].trainerId

        console.log("index =",index,trainerId, trainerName,trainer)
  
        if (!demoDate || !trainer) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields!'
          });
          return;
        }
  
        let tempDemoData = demoData;
        let tempLeadData = latestData;
  
        tempLeadData[index].scheduleDate = demoDate;
        tempLeadData[index].finalStatus = "";
        tempLeadData[index].finalStatusFrom = "";
        tempLeadData[index].finalDate = "";
  
        let objNew = {};
        let obj = {};
  
        element.students.forEach(data => {
          objNew[data.name] = data.values;
        });
  
        obj.demoStudent = objNew;
        obj.finalStatus = "";
        obj.finalStatusFrom = "";
        obj.finalDate = "";
        obj.date = element.assignedDate;
        obj.status = "Demo";
        obj.demoStatus = "";
        obj.counselorNo = element.counsellorNo;
        obj.campaignId = element.campaignId;
        obj.campaignName = element.campaignName;
        obj.id = element.id;
        obj.reschedule = demoDate;
        obj.scheduleDate = currentDate;
        obj.trainer = trainerName;
        obj.trainerId = trainerId;
  
        tempDemoData.push(obj);
        setDemoData(tempDemoData);
  
        tempLeadData[index].status = value;
        setLeadData(tempLeadData);
  
        console.log("Updated demo data:", tempDemoData);
        console.log("Updated lead data:", tempLeadData);
  
        Swal.fire({
          icon: 'success',
        });
      }
    });
  };

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();

    setAllCounsellor(allCounselor.counselorData)
  }
  const getAllTrainer = async()=>{

    let allTrainer = await ContextValue.getTrainer();

    console.log("allTrainer.trainerData", allTrainer.trainerData, allTrainer )

    setTrainer(allTrainer.trainerData)
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

    let tempCounsellorAllLead = latestData

    tempCounsellorAllLead[dataIndex].counsellorNo = allCounsellor[counsellorIndex].counselorNo;
    tempCounsellorAllLead[dataIndex].counsellorName = allCounsellor[counsellorIndex].Name

    setLatestData(tempCounsellorAllLead)


  }


  const addLead = async (e) => {

    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    e.preventDefault();
   console.log("temp latest data =",latestData)
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

  let tempLeadData = leadData;

  let tempAllLeadData = latestData;

  console.log("from route =",tempAllLeadData)

  try 
  {
    let url = `https://counsellorlead-2.onrender.com/counselorLead`
    ContextValue.updateProgress(20);

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

    ContextValue.updateProgress(100);
    ContextValue.updateBarStatus(false);

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



    if(demoData.length>0){

      console.log("demo data length =",demoData)
      try {

        let url = `https://counsellorlead-2.onrender.com/counselorDemo`
        ContextValue.updateProgress(60);
  
        const res = await fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("counsellor"),
            "status":"allLead"
          },
          body: JSON.stringify(demoData),
        });
  
        ContextValue.updateProgress(60);
  
        const data = await res.json();

        ContextValue.updateProgress(100);
        ContextValue.updateBarStatus(false);
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
  
        if (visitData.length>0){
          console.log("if from visit and followup length",visitData)
          try {
  
            let url = `https://counsellorlead-2.onrender.com/counselorVisit`
            ContextValue.updateProgress(60);
      
            const res = await fetch(`${url}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("counsellor"),
                "status":"allLead"
              },
              body: JSON.stringify(visitData),
            });
      
            ContextValue.updateProgress(60);
      
            const data = await res.json();
            ContextValue.updateProgress(100);
                ContextValue.updateBarStatus(false);
      
            console.log("progress bar 100")

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


            if(followUpData.length>0){
              console.log("follow up data length", followUpData.length)
              try {
  
                let url = `https://counsellorlead-2.onrender.com/counselorFollowUp`
                ContextValue.updateProgress(60);
          
                const res = await fetch(`${url}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("counsellor"),
                    "status":"allLead"
                  },
                  body: JSON.stringify(followUpData),
                });
          
                ContextValue.updateProgress(60);
          
                const data = await res.json();
                ContextValue.updateProgress(100);
                ContextValue.updateBarStatus(false);
          
                console.log("progress bar 100")
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

  setLatestData([])

  console.log("new date =",new Date().getDate())

  let todayDate = formatDate(new Date())

  ContextValue.updateProgress(20);
  ContextValue.updateBarStatus(true);

  // console.log("rangeDate =",rangeDate,todayDate)

  // console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)

  try
  {
    let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorLeadFilter',{
      method:'GET',
      headers:{
        "counselorNo":localStorage.getItem("counsellorNo"),
        'campaignId': campaign.id,
        'startDate': rangeDate.startDate,
        'endDate': rangeDate.endDate
      }
    })
    ContextValue.updateProgress(60);
    totalLead = await totalLead.json();
    
    // setTotalLead(totalLead.totalLead)
    // setLeadCount(totalLead.totalCount)
    console.log("lead count =",totalLead);
    setLatestData(totalLead.totalLead);    
    setDemoData(totalLead.totalDemo)    
    setVisitData(totalLead.totalVisit)
    setFollowUpData(totalLead.totalFollowUp)
    ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
  }
    catch(error){
      console.log("error =",error.message)
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
                obj.finalStatus = ""
                obj.finalStatusFrom = ""
                obj.finalDate = ""
                obj.visitTrainer = ""
                obj.visitCounsellor = ""
                obj.visitDate = visitDate
                obj.visitStatus = "Visit"
                obj.campaignId = element.campaignId
                obj.campaignName = element.campaignName
                obj.id = element.id
             
      
              tempVisitData.push(obj)
              setVisitData(tempVisitData)
      
              let tempLeadData = latestData;
              tempLeadData[index].status=value
              tempLeadData[index].scheduleDate=visitDate
              tempLeadData[index].finalStatus = ""
              tempLeadData[index].finalStatusFrom = ""
              tempLeadData[index].finalDate = ""
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
                obj.status="Follow Up"
                obj.FollowUp=[{
                  date:followUpDate,
                  remark:remark
                }]
                obj.lastFollowUpDate=followUpDate
                obj.status="Follow Up"
                obj.finalStatus = ""
                obj.finalStatusFrom = ""
                obj.finalDate = ""
                obj.date=element.assignedDate
                obj.campaignId = element.campaignId
                obj.campaignName = element.campaignName
                obj.id=element.id
             
      
              tempFollowUpData.push(obj)
              setFollowUpData(tempFollowUpData)
      
              let tempLeadData = latestData;
              tempLeadData[index].status=value
              tempLeadData[index].scheduleDate=followUpDate
              tempLeadData[index].finalStatus = ""
              tempLeadData[index].finalStatusFrom = ""
              tempLeadData[index].finalDate = ""
              
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

        console.log('value and index status =',value,index,element,latestData)
      
        if(latestData[index].status=="")
        {
          console.log("if condition ",latestData)
        if(value=="Demo"){
          addDemo(element,index, value)
        }
        else if(value=="Visit"){
          addVisit(element, index, value)
        }
        else if(value=="Follow Up"){
          addFollowUp(element, index, value)
        }
        else if(value=="Registered"){
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          tempLatestData[index].finalStatus = value
          tempLatestData[index].finalStatusFrom = "Direct"
          tempLatestData[index].finalDate = formatDate(new Date())
          console.log("else is running registered",tempLatestData)
          setLatestData(tempLatestData)
        }
        else{
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          tempLatestData[index].finalStatus = ""
          tempLatestData[index].finalStatusFrom = ""
          tempLatestData[index].finalDate = ""
          tempLatestData[index].scheduleDate = formatDate(new Date())
          console.log("else is running",tempLatestData)
          setLatestData(tempLatestData)
        }
      }
      
      else if(latestData[index].status!=value)
        console.log("else latest data value  =",latestData)
        {
      
        if(latestData[index].status=="Demo"){
          let tempDemoData = demoData;
          tempDemoData.map(data=>{
              if(data.id==element.id){
                data.status="Changed"
              }
          })
      
          console.log("demo student after filter =",tempDemoData)

          setDemoData(tempDemoData)
        }
      
        else if(latestData[index].status=="Visit")
          {
          let tempVisitData = visitData
          tempVisitData.map(data=>{
              if(data.id==element.id){
                data.visitStatus="Changed"
              }
          })
      
          console.log("temp visit data =",tempVisitData)
      
          setVisitData(tempVisitData)
        }
       
        else if(latestData[index].status=="Follow Up"){
          console.log("follow up status = ",followUpData)
          let tempFollowUpData = followUpData
          tempFollowUpData.map(data=>{
  
              if(data.id==element.id){
                data.status="Changed"
              }
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

        else if(value=="Registered"){
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          tempLatestData[index].finalStatus = value
          tempLatestData[index].finalStatusFrom = "Direct"
          tempLatestData[index].finalDate = formatDate(new Date())
          console.log("else is running registered",tempLatestData)
          setLatestData(tempLatestData)
        }
        else{
          let tempLatestData = latestData;
          tempLatestData[index].status = value
          tempLatestData[index].finalStatus = ""
          tempLatestData[index].finalStatusFrom = ""
          tempLatestData[index].finalDate = ""
          tempLatestData[index].scheduleDate = formatDate(new Date())
          console.log("else is running",tempLatestData)
          setLatestData(tempLatestData)
        }
      }
      
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

      const setRemarks =(value,index)=>{

        console.log("remarks value =",value,index)
        let tempLatestData = latestData;

        tempLatestData[index].remarks = value
        setLatestData(tempLatestData)

        console.log("tempLatestData =",tempLatestData)

      }


 return(
    <div>
            <h3>All Lead - {latestData.length}</h3>

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
        </select>}
       
       <button onClick={getLead}>Search</button>
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
                        <option selected disabled value="selected">-- Select Status--</option>
                    
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

export default CounsellorAllLead;
