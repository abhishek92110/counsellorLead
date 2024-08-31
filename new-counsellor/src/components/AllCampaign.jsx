import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from '../context/DataState'

const AllCampaign = () => {
  const [latestData, setLatestData] = useState([])
  const [allCounsellor, setAllCounsellor] = useState([])
  const [allCampaign, setAllCampaign] = useState([])
  const [timeValue,setTimeValue] = useState() 
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

    console.log('context value =',ContextValue)

    getCounsellorCampaign()
   

  },[])

  const getCounsellorCampaign = async()=>{
    await getAllCampaign()
    await getAllCounsellor()
  }

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

    console.log("rangeDate =",rangeDate)
    try {
      ContextValue.updateProgress(20);
      ContextValue.updateBarStatus(true);
  
      let totalLead = await fetch('https://counsellorlead-2.onrender.com/getcounselorLeadFilter', {
        method: 'GET',
        headers: {
          'counselorNo': counsellor.counsellorNo,
          'campaignId': campaign.id,
          'startDate': rangeDate.startDate,
          'endDate': rangeDate.endDate
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

  const assignCampaign  = async()=>{

  }


  const setAssignedCounsellor = (index)=>{

    
    var selectElement = document.getElementsByClassName("assigned-counsellor-class");

    // let tempArr = tempObj[allCounsellor[selectElement[index].selectedIndex].counselorNo]

    let counsellorIndex = (selectElement[index].selectedIndex)-1
    let dataIndex = index

    let tempCounsellor = allCounsellor

    tempCounsellor.map(data=>{
     let tempid = data.campaignId.filter(element=>{
        return (!(element==allCampaign[index].id))
      })
     let tempname = data.campaignName.filter(element=>{
        return (!(element==allCampaign[index].name))
      })

      data.campaignId = tempid
      data.campaignName =tempname
    })


    console.log("temp value =",tempCounsellor)

    tempCounsellor[counsellorIndex].campaignId.push(allCampaign[index].id)
    tempCounsellor[counsellorIndex].campaignName.push(allCampaign[index].name)

  console.log("value after all this=",counsellorIndex,index,tempCounsellor)
  setAllCounsellor(tempCounsellor)

  }


 return(
    <div>
            <h3>All Campaign -{allCampaign.length} </h3>
            
           <button className='btn btn-primary' onClick={assignCampaign}>Assign Campaign</button>
      
        {allCampaign.length>0 &&
            <table>

            <tr>
              <th>Campaign</th>
              <th>Counsellor</th>

            </tr>

              {allCampaign.map((element,index)=>{
        return(
          <tr>
  <td><pre><b>{index+1}</b>. {element.name}</pre></td>
  <td>
    <select
        name="Course"
        className="custom-select mr-sm-2 assigned-counsellor-class"
        onChange={e => setAssignedCounsellor(index)}
        defaultValue={element.counsellorName} // Assuming you need to pass the selected value
      > 
      <option value="selected">--Select Counsellor--</option> 
        {allCounsellor.map((data, index) => {
          return (
            <option key={index} value={data.Name}>{data.Name}</option>
          );
        })}
      </select></td>
</tr>

        )
      })}
          </table>
}       </div>
 )
};

export default AllCampaign;
