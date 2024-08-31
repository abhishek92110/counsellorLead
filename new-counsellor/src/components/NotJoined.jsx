import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'

const NotJoined = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [allCampaign, setAllCampaign] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [from, setFrom] = useState("")
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

  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    let tempDate = formatDate(new Date())

    console.log("today date =",tempDate)

    let tempRangeDate = rangeDate;

    tempRangeDate.startDate = tempDate;
    tempRangeDate.endDate = tempDate

    console.log('context value =',ContextValue)

    
    getAllCampaign()
getAllCounsellor()
    getLeadFilter()


  },[])

  const getAllCounsellor = async()=>{

    let allCounselor = await ContextValue.getAllCounselor();
    console.log("all counselor =",allCounselor.counselorData)

    setAllCounsellor(allCounselor.counselorData)
  }
  const getAllCampaign = async()=>{

    let allCampaign = await ContextValue.getAllCampaign();

    console.log("all campaign =",allCampaign)

    setAllCampaign(allCampaign.data)
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
          'counselorNo': counsellor.counsellorNo,
          'campaignId': campaign.id,
          'from':from,
          'startDate': rangeDate.startDate,
          'endDate': rangeDate.endDate,
          'status':"Not Joined"
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

      let tempLeadData = latestData.filter(data=>{
        return(data.counsellorNo=="")
      })

      const CACHE_KEY = 'latestFacebookAdData';
      localStorage.setItem(CACHE_KEY, JSON.stringify(tempLeadData));
  
      // Once all data is sent, you can update the progress bar and call the success message
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      // SuccessMsg();
  
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


  const setAssignedCounsellor = (index)=>{

    
    var selectElement = document.getElementsByClassName("assigned-counsellor-class");

    // let tempArr = tempObj[allCounsellor[selectElement[index].selectedIndex].counselorNo]

    let counsellorIndex = selectElement[index].selectedIndex
    let dataIndex = index

  console.log("value =",selectElement[index].selectedIndex,index)

  let tempNotJoined = latestData

  tempNotJoined[dataIndex].counsellorNo = allCounsellor[counsellorIndex].counselorNo;
  tempNotJoined[dataIndex].counsellorName = allCounsellor[counsellorIndex].Name

  console.log("tempNotJoined =",tempNotJoined)

  setLatestData(tempNotJoined)

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

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
const month = String(parseInt(date.getMonth()) + 1).padStart(2,'0')
const year = date.getFullYear();

return (`${year}-${month}-${day}`)
  };


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
            <h3>Not Joined - {latestData.length}</h3>
            
            {/* <div className="filter-section">
            <label>Select Date</label>
          <input type='date' className='filter-btn'/>
          <select className='filter-btn'>
            <option selected disabled>select campaign</option>
            <option>Campaign</option>
            <option>Campaign</option>
            <option>Campaign</option>
            <option>Campaign</option>
          </select>
          <select className='filter-btn'>
            <option selected disabled>select Counsellor</option>
            <option>Counsellor</option>
            <option>Counsellor</option>
            <option>Counsellor</option>
            <option>Counsellor</option>
          </select>
          </div> */}

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
      {allCounsellor.length>0 &&  <select className='filter-btn'
      onChange={e=>{setCounsellorDetail(e.target.value)}}>
          <option selected disabled>select Counsellor</option>
        {
          allCounsellor.map((data,index)=>{
                return(
                  <option value={index}>{data.Name}</option>
                )
          })
        }
        </select>}

        <select className='filter-btn' onChange={e=>{setFrom(e.target.value)}}>
          <option selected disabled>--select From--</option>
          <option value="Demo">Demo</option>
          <option value="Visit">Visit</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Direct">Direct</option>
        </select>

       
       
       <button onClick={getLeadFilter}>Search</button>
        </div>
        
        {latestData.length>0 && <button onClick={addLead}>Assign Counsellor</button>}
        {latestData &&
            <table>

            <tr>
              <th>Campaign</th>
              <th>Assigned Date</th>
              <th>Status Date</th>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Email</th>


          <th>Assigned Counsellor</th>
          <th>Student Status</th>
            </tr>

              {latestData.map((element,index)=>{
        return(
          <tr>
  <td>{latestData[index].campaignName}</td>
  <td>{latestData[index].assignedDate}</td>
  <td>{latestData[index].finalDate}</td>
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
 
 
    <td>
      <select
        name="Course"
        className="custom-select mr-sm-2 assigned-counsellor-class"
        onChange={e => setAssignedCounsellor(index)}
        defaultValue={element.counsellorName?element.counsellorName:"selected"}  // Assuming you need to pass the selected value
      >  
      
      <option disabled selected value="selected">--Select Counsellor--</option>
        {allCounsellor.map((data, index) => {
          return (
            
            <option key={index} value={data.Name}>{data.Name}</option>
          );
        })}
      </select>
    </td>
    
  
 
 <td>{element.status==""?"No Report":`Assigned to ${element.status}`}</td>
</tr>

        )
      })}
          </table>
}       </div>
 )
};

export default NotJoined;
