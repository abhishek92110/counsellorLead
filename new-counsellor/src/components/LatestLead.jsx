import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'
import Swal from "sweetalert2";

const AllLead = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [counsellorStatus, setCounsellorStatus] = useState(false)
  const [todayDate, setTodayDate] = useState()
  const [addLeadStatus, setAddLeadStatus] = useState(false)
  const [counsellor, setCounsellor] = useState({
    counselorNo:"",
    counselorName:""
  })

  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    setAddLeadStatus(false)

    console.log('context value =',ContextValue)

    let tempDate  = formatDate(new Date())
    setTodayDate(tempDate)

    console.log("formate date =",tempDate)

    if (ContextValue){
    console.log("if condition")
    getCounsellorLatestData()
   
    }

  },[addLeadStatus])

  const getCounsellorLatestData = async()=>{
    await getAllCounsellor()
    await getLatestData()
  }

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();

    setAllCounsellor(allCounselor.counselorData)
  }

  const getLatestData = async()=>{
    console.log("get latest data is running")
    setLatestData([])

    console.log("get latest")
    let leadData = await ContextValue.getLatestData()
    setLatestData(leadData)
    console.log("lead data =",leadData)
  }

  const setAssignedCounsell = (index)=>
    {

      var selectElement = document.getElementsByClassName("assigned-counsellor-class");

      // let tempArr = tempObj[allCounsellor[selectElement[index].selectedIndex].counselorNo]

      let counsellorIndex = selectElement[index].selectedIndex
      let dataIndex = index

    console.log("value =",selectElement[index].selectedIndex,index)

    let tempAllLead = latestData

    tempAllLead[dataIndex].counsellorNo = allCounsellor[counsellorIndex].counselorNo;
    tempAllLead[dataIndex].counsellorName = allCounsellor[counsellorIndex].Name

    setLatestData(tempAllLead)


  }
  const setAssignedCounsellor = (index)=>
    {

      let tempcounselor  = counsellor;

    tempcounselor.counselorNo = allCounsellor[index].counselorNo;
    tempcounselor.counselorName = allCounsellor[index].Name

    let tempLatestData = latestData;

    tempLatestData.map(data=>{
      if(data.assignedDate!=""){
        data.counsellorNo = allCounsellor[index].counselorNo
        data.counsellorName = allCounsellor[index].Name
      }
    })

    setLatestData(tempLatestData)

    console.log("temp counselor =",tempcounselor,tempLatestData)

    setCounsellor(tempcounselor)
  }


  // const addLead = async (e) => {

  //   ContextValue.updateProgress(30);
  //   ContextValue.updateBarStatus(true);

  //   e.preventDefault();
  //   // let tempInpVal = inpval;
  //   // console.log("lead date is  =",tempInpVal.date)
  //   // let dateArray = tempInpVal.date.split("-");
  //   // console.log("registration array =", dateArray);
  //   // tempInpVal.date = dateConvert(tempInpVal.date);
  //   // tempInpVal.month = dateArray[1];
  //   // tempInpVal.year = dateArray[0];
  //   // tempInpVal.Day = dateArray[2];

  //   // tempInpVal.date = `${tempInpVal.year}-${tempInpVal.month}-${tempInpVal.Day}`

  //   // console.log("register value =", tempInpVal);


  //   console.log("timestamp",latestData[0].created_time, latestData)
  //   const timestamp = latestData[0].created_time;
  //   const date = timestamp.split('T')[0];
  

  //   console.log("size of variable =",new Blob([latestData]).size)
  //   let firstTenElements = latestData.slice(0, 100);
  //   console.log("timestamp",latestData[0].created_time, latestData, firstTenElements)


  //   try {

  //     let url = `https://counsellorlead-2.onrender.com/counselorLead`
  //     ContextValue.updateProgress(60);

  //     const res = await fetch(`${url}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "auth-token": localStorage.getItem("counsellor")
  //       },
  //       // body: JSON.stringify(firstTenElements),
  //       body: JSON.stringify(firstTenElements),
  //     });

  //     ContextValue.updateProgress(60);

  //     // const data = await res.json();

  //     console.log("progress bar 100")

  //     ContextValue.updateProgress(100);
  //     ContextValue.updateBarStatus(false);
  //     // SuccessMsg();


  //   } 
  //   catch(error) {
  //     ContextValue.updateProgress(100);
  //     ContextValue.updateBarStatus(false);
  //     // Swal.fire({
  //     //   icon: "error",
  //     //   title: "Oops...",
  //     //   text: "Something went wrong!",
  //     // });

  //     console.log("error =", error.message);
  //   }
    

  //   const getLead = async()=>{

  //     ContextValue.updateProgress(20);
  //     ContextValue.updateBarStatus(true);
  
  //     // console.log("counsellor no from getLead =",localStorage.getItem("counsellorNo"),rangeDate.startDate,rangeDate.endDate)
  
  //     try{
  //       let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorLeadCount',{
  //         method:'GET',
  //         headers:{
  //           "counselorNo":localStorage.getItem("counsellorNo"),
  //           // "startDate":rangeDate.startDate,
  //           // "endDate":rangeDate.endDate
  //         }
  //       })
    
  //       totalLead = await totalLead.json();
  //       // setTotalLead(totalLead.totalLead)
  //       // setLeadCount(totalLead.totalCount)
  //       console.log("lead count =",totalLead);
  //     }
  //       catch(error){
  //         ContextValue.updateProgress(100);
  //         ContextValue.updateBarStatus(false);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: "Something went wrong!",
  //         });
  //       }
  
  //   }

  // };

  const addLead = async (e) => {
    e.preventDefault();

    ContextValue.updateProgress(20);
  
    try {
      // Function to chunk the array into smaller arrays of the specified size
      const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      };
  
      // Split the latestData into chunks of 100 elements each
      const dataChunks = chunkArray(latestData, 100);
      
      // Process each chunk sequentially
      for (let i = 0; i < dataChunks.length; i++) 
        {
        console.log(`Sending chunk ${i + 1} of ${dataChunks.length}`);
        const firstTenElements = dataChunks[i];

        ContextValue.updateProgress(60);
  
        const res = await fetch('https://counsellorlead-2.onrender.com/counselorLead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('counsellor')
          },
          body: JSON.stringify(firstTenElements),
        });
  
        if (!res.status) {
          throw new Error(`Failed to send chunk ${i + 1}`);
        }
  
        console.log(`Chunk ${i + 1} sent successfully`);
      }
  
      console.log("All chunks sent successfully");
      setLatestData([])
      setAllCounsellor([])
      setAddLeadStatus(true)
      setCounsellorStatus(false)      

      let tempLeadData = latestData.filter(data=>{
        return(data.counsellorNo=="")
      })

      const CACHE_KEY = 'latestFacebookAdData';
      localStorage.setItem(CACHE_KEY, JSON.stringify(tempLeadData));
  
      // Once all data is sent, you can update the progress bar and call the success message
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      SuccessMsg();
  
    } catch (error) {
      console.log("Error =", error.message);
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Something went wrong!",
      // });
    }
  };

  const SuccessMsg=()=>
    {

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: ``,
      showConfirmButton: false,
      timer: 1500
    })
    
  }
  
  // Example function to get the lead count (You can call this function after sending all chunks)
  const getLead = async () => {
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorLeadCount', {
        method: 'GET',
        headers: {
          'counselorNo': localStorage.getItem('counsellorNo'),
          // 'startDate': rangeDate.startDate,
          // 'endDate': rangeDate.endDate
        }
      });
  
      totalLead = await totalLead.json();
      console.log("Lead count =", totalLead);
  
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
  
    } catch (error) {
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

    const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(parseInt(date.getMonth()) + 1).padStart(2,'0')
    const year = date.getFullYear();
    
    return (`${year}-${month}-${day}`)
    };
  
  const AssignedCounsellor  =(index,checked)=>{

  
    console.log("today date =",todayDate)
    let tempLatestData = latestData

    if(checked){
      tempLatestData[index].counsellorName = counsellor.counselorName
      tempLatestData[index].counsellorNo = counsellor.counselorNo
      tempLatestData[index].assignedDate = todayDate
    }

    else{

      tempLatestData[index].counsellorName = ""
      tempLatestData[index].counsellorNo = ""
      tempLatestData[index].assignedDate = ""

    }
    

    console.log("value = ",checked,index,tempLatestData)

    setLatestData(tempLatestData)

    console.log("assigned counsellor working")
  }


 return(
    <div>
            <h3>Latest Lead - {latestData.length}</h3>

          <div className='assigned-counsellor'>
            <button onClick={addLead}>Assign Counsellor</button>

            {allCounsellor.length > 0 &&
      <select
        name="Course"
        className="custom-select mr-sm-2 assigned-counsellor-class"
        onChange={e => {setAssignedCounsellor(e.target.value);setCounsellorStatus(true)}} // Assuming you need to pass the selected value
      >  
      <option selected disabled>-- Select Counsellor --</option>
        {allCounsellor.map((data, index) => {
          return (
            <option key={index} value={index}>{data.Name}</option>
          );
        })}
      </select>
    
  }
  </div>
      
          {latestData.length>0 &&
            <table>

            <tr>
              <th>Campaign</th>
              <th>Created Time</th>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>
            </tr>

              {latestData.map((element,index)=>{
        return(
          <tr>
           
  <td><input type="checkbox" class="data-checkbox" disabled={(!counsellorStatus)} onChange={(e)=>{AssignedCounsellor(index,e.target.checked)}}/> {latestData[index].campaignName}</td>
  <td>{latestData[index].created_time}</td>
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
</tr>

        )
      })}
          </table>
}        </div>
 )
};

export default AllLead;
