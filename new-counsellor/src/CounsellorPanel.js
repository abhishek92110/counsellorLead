import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from './context/DataState'
import LatestLead from './components/LatestLead';
import AllLead from './components/AllLead';
import FollowUp from './components/FollowUp';
import Demo from './components/Demo';
import Visit from './components/Visit';
import CounsellorLatestLead from './components/CounsellorLatestLead';
import CounsellorAllLead from './components/CounsellorAllLead';
import CounsellorFollowUp from './components/CounsellorFollowUp';
import CounsellorDemo from './components/CounsellorDemo';
import CounsellorVisit from './components/CounsellorVisit';
import LoadingBar from 'react-top-loading-bar'
import { HashLoader } from "react-spinners";
import CounsellorRinging from './components/CounsellorRinging';
import CounsellorConnected from './components/CounsellorConnected';
import CounsellorRegistered from './components/CounsellorRegistered';
import CounsellorNotJoined from './components/CounsellorNotJoined';
import CounsellorNotInterested from './components/CounsellorNotInterested';
import CounsellorNoResponse from './components/CounsellorNoResponse';

const CounsellorPanel = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [progress, setProgress] = useState(50)

  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    console.log('context value from counsellor panel=',ContextValue)


  },[ContextValue.progress])

  const renderTable = () => {
    switch (activeSection) {
      case 'section-1':
        return <CounsellorLatestLead/>;
      case 'section-2':
        return <CounsellorAllLead/>;
      case 'section-3':
        return <CounsellorFollowUp/>;
      case 'section-4':
        return <CounsellorDemo/>;
              case 'section-5':
                return <CounsellorVisit/>;
              case 'section-6':
                return <CounsellorRinging/>;
              case 'section-7':
                return <CounsellorConnected/>;
              case 'section-8':
                return <CounsellorRegistered/>;
              case 'section-9':
                return <CounsellorNotJoined/>;
              case 'section-10':
                return <CounsellorNotInterested/>;
              case 'section-11':
                return <CounsellorNoResponse/>;
      default:
        return <div>Default Table</div>;
    }
  };

  return (
    <div className="counsellor-panel">

<LoadingBar
        color='#f11946'
        progress={ContextValue.progress}
        // onLoaderFinished={() => setProgress(0)}
      />
      
     {  ContextValue.barStatus 
     
     && (
      <>
      {console.log("bar status from counsellor panel")}
      <div className='pos-center'>
        <HashLoader color="#3c84b1" />
      </div>
      <div className='blur-background'></div>
      </>
    )
    }

      <header>
        <h1>Counsellor Panel</h1>

        <strong>{localStorage.getItem("counsellorName")}</strong>
      </header>
      <main>
        <div className="buttons">
          <button onClick={() => setActiveSection('section-1')} className={activeSection=="section-1"?"selected-btn":""}>Latest Lead</button>
          <button onClick={() => setActiveSection('section-2')} className={activeSection=="section-2"?"selected-btn":""}>All Lead</button>
          <button onClick={() => setActiveSection('section-3')} className={activeSection=="section-3"?"selected-btn":""}>Follow Up</button>
          <button onClick={() => setActiveSection('section-4')} className={activeSection=="section-4"?"selected-btn":""}>Demo</button>
          <button onClick={() => setActiveSection('section-5')} className={activeSection=="section-5"?"selected-btn":""}>Visit</button>
          <button onClick={() => setActiveSection('section-6')} className={activeSection=="section-6"?"selected-btn":""}>Ringing</button>
          <button onClick={() => setActiveSection('section-7')} className={activeSection=="section-7"?"selected-btn":""}>Connected</button>
          <button onClick={() => setActiveSection('section-8')} className={activeSection=="section-8"?"selected-btn":""}>Registered</button>
          <button onClick={() => setActiveSection('section-9')} className={activeSection=="section-9"?"selected-btn":""}>Not Joined</button>
          <button onClick={() => setActiveSection('section-10')} className={activeSection=="section-10"?"selected-btn":""}>Not Interested</button>
          <button onClick={() => setActiveSection('section-11')} className={activeSection=="section-11"?"selected-btn":""}>No Response</button>
        </div>
        <div className="table-section">
          {renderTable()}
        </div>
      </main>
      <footer>
        <p>&copy; 2024 MyApp</p>
      </footer>
    </div>
  );
};

export default CounsellorPanel;
