import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'

const FollowUp = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [allCampaign, setAllCampaign] = useState([])
  const [timeValue,setTimeValue] = useState() 
  const [counsellorStatus, setCounsellorStatus] = useState(false)
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

    setRangeDate(tempRangeDate)

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
  
      let totalLead = await fetch('http://localhost:8000/getcounselorFollowUpFilter', {
        method: 'GET',
        headers: {
          'counselorNo': counsellor.counsellorNo,
          'campaignId': campaign.id,
          'startDate': rangeDate.startDate,
          'endDate': rangeDate.endDate
        }
      });
  
      totalLead = await totalLead.json();
      console.log("followUp count =", totalLead);
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
            <h3>All Follow Up - {latestData.length}</h3>
            
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

       
       
       <button onClick={getLeadFilter}>Search</button>
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


          <th>Assigned Counsellor</th>
            </tr>

              {latestData.map((element,index)=>{
        return(
          <tr>
  <td>{latestData[index].campaignName}</td>
  <td>{latestData[index].date}</td>
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
  console.log("data =",data,key)

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
        name="Course"
        className="custom-select mr-sm-2 assigned-counsellor-class"
        onChange={e => setAssignedCounsellor(index)}
        defaultValue={(allCounsellor.find(item => item.counselorNo === element.counselorNo)).Name} // Assuming you need to pass the selected value
      
      >  

      {console.log("counselor name =",(allCounsellor.find(item => item.counselorNo === element.counselorNo)))}

        {allCounsellor.map((data, index) => {
          return (
            <option key={index} value={data.Name}>{data.Name}</option>
          );
        })}
      </select>
    </td>
  }
</tr>

        )
      })}
          </table>
}       </div>
 )
};

export default FollowUp;
