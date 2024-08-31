import React, { useState } from 'react'
// import StudentContext from './StudentContext'
import { createContext } from "react";
import Swal from 'sweetalert2'

export const DataContext = createContext();



const DataState = (props) => {
    const [allCounselor, setAllCounselor] = useState()
    const [progress, setProgress]  = useState(0)
    const [barStatus, setBarStatus]  = useState(false)


    const updateProgress = (length)=>{

      setProgress(length)
      console.log('progress length =',length)
      
    }
    const updateBarStatus = (value)=>{
      console.log("value for bar status=",value)
      setBarStatus(value)
    }    

    const getAllCounselor = async () => {
      updateProgress(30);
        updateBarStatus(true);
        let allCounselor = await fetch("https://counsellorlead-2.onrender.com/getAllCounselor", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        updateProgress(60);
    
        allCounselor = await allCounselor.json()
        console.log('state counselor =',allCounselor)
        setAllCounselor(allCounselor)
        updateProgress(100);
        updateBarStatus(false);
        return allCounselor
      }
    const getAllCampaign = async () => {

      updateProgress(30);
      updateBarStatus(true);
        let allCampaign = await fetch("https://counsellorlead-2.onrender.com/getfacebookCampaignData", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        updateProgress(60);
    
        allCampaign = await allCampaign.json()

        updateProgress(100);
        updateBarStatus(false);
        console.log('state campaign =',allCampaign,barStatus)
        return allCampaign
      }


      const getTrainer = async () => {

        updateProgress(30);
        updateBarStatus(true);
          let allTrainer = await fetch("https://counsellorlead-2.onrender.com/getTrainers", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
  
          updateProgress(60);
      
          allTrainer = await allTrainer.json()
  
          updateProgress(100);
          updateBarStatus(false);
          console.log('alltrainer =',allTrainer)
          return allTrainer
        }


      const getLatestData = async () => {
        console.log("calling get latest data");
        const CACHE_KEY = 'latestFacebookAdData';
        const CACHE_EXPIRY_KEY = 'latestFacebookAdDataExpiry';
        // const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
        const CACHE_EXPIRY_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds

      
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
        // Check if cached data exists and is still valid
        let tempLeaData;
        if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) 
          {
            console.log('Using cached data', JSON.parse(cachedData).length, JSON.parse(cachedData));
            tempLeaData = JSON.parse(cachedData);
    
          console.log("all lead data from state hook =", tempLeaData);
          return tempLeaData;
        }
      
        // If no valid cache, proceed to fetch the latest data
        updateProgress(30);
        updateBarStatus(true);
      
        try {
            let totalLatestData = await fetch('https://counsellorlead-2.onrender.com/getLatestFacebookAdData', {
                method: 'GET',
            });
      
            updateProgress(60);
      
            totalLatestData = await totalLatestData.json();
      
            updateProgress(100);
            updateBarStatus(false);
      
            // Store the response data in the cache
            
      
            // Update the state with the latest data
            console.log('All latest lead data =', totalLatestData.data);    
            tempLeaData = totalLatestData.data;
            
            // Process and update the tempAdLeadData
            let tempAdLeadData = tempLeaData.map(data => {
                console.log("lead data inside map",data.created_time.split("T")[0]);
                return {
                    id: data.data_id,
                    adId: data.ad_id,
                    adName: data.ad_name,
                    campaignId: data.campaign_id,
                    campaignName: data.campaign_name,
                    students: data.field_data,
                    created_time: data.created_time.split("T")[0],
                    assignedDate: "",
                    counsellorNo:"",
                    counsellorName:"",
                    status:"",
                    remarks:""
                };
            });
            localStorage.setItem(CACHE_KEY, JSON.stringify(tempAdLeadData));
            localStorage.setItem(CACHE_EXPIRY_KEY, Date.now() + CACHE_EXPIRY_TIME);
    
            console.log("all lead data from state hook =", tempAdLeadData);

            return tempAdLeadData;
    
        } 
        catch (error) {
            updateProgress(100);
            updateBarStatus(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

const SuccessMsg=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Candidate Has Been Registered',
    showConfirmButton: false,
    timer: 1500
  })
  
}

  return (
    <div>
      <DataContext.Provider value={{ student:"checking", allCounselor:allCounselor,getLatestData:getLatestData, getAllCounselor:getAllCounselor, updateProgress:updateProgress, updateBarStatus:updateBarStatus, progress:progress, barStatus:barStatus,getAllCampaign:getAllCampaign,getTrainer:getTrainer}}>
        {props.children}
      </DataContext.Provider>
    </div>
  )
}

export default DataState;