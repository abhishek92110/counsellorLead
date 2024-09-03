import React, { useEffect, useState, useContext } from 'react';
import {DataContext} from './context/DataState'
import LatestLead from './components/LatestLead';
import AllLead from './components/AllLead';
import FollowUp from './components/FollowUp';
import Demo from './components/Demo';
import Visit from './components/Visit';
import LoadingBar from 'react-top-loading-bar'
import { HashLoader } from "react-spinners";
import AllCampaign from './components/AllCampaign';
import Ringing from './components/Ringing';
import Connected from './components/Connected';
import Registered from './components/Registered';
import NotJoined from './components/NotJoined';
import NotInterested from './components/NotInterested';
import NoResponse from './components/NoResponse';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('section-1');
  const [latestData, setLatestData] = useState([])
  const [progress, setProgress] = useState(50)

  let ContextValue = useContext(DataContext);
  console.log('context value before=',ContextValue)

  useEffect(()=>{

    console.log('context value =',ContextValue)


  },[])

  const renderTable = () => {
    switch (activeSection) {
      case 'section-1':
        return <LatestLead/>;
      case 'section-2':
        return <AllCampaign/>;
      case 'section-3':
        return <AllLead/>;
      case 'section-4':
        return <FollowUp/>;
      case 'section-5':
        return <Demo/>;
              case 'section-6':
                return <Visit/>;
                case 'section-7':
                  return <Ringing/>;
                case 'section-8':
                  return <Connected/>;
                case 'section-9':
                  return <NoResponse/>;
                case 'section-10':
                  return <Registered/>;
                case 'section-11':
                  return <NotJoined/>;
                case 'section-12':
                  return <NotInterested/>;
      default:
        return <div>Default Table</div>;
    }
  };

  return (
    <div className="counsellor-panel">

<LoadingBar
        color='#f11946'
        progress={ContextValue.progress}
        onLoaderFinished={() => setProgress(0)}
      />
      
     {/* {  ContextValue.barStatus 
     
     && (
      <>
      <div className='pos-center'>
        <HashLoader color="#3c84b1" />
      </div>
      <div className='blur-background'></div>
      </>
    )
    } */}
     {  ContextValue.barStatus 
 
     && (
      <>
      {console.log("bar status")}
      <div className='pos-center'>
        <HashLoader color="#3c84b1" />
      </div>
      <div className='blur-background'></div>
      </>
    )
    }

      <header>
        <h1>Admin Panel</h1>
      </header>
      <main>
        <div className="buttons">
          <button onClick={() => setActiveSection('section-1')} className={activeSection=="section-1"?"selected-btn":""}>Latest Lead</button>
          <button onClick={() => setActiveSection('section-2')} className={activeSection=="section-2"?"selected-btn":""}>All Campaign</button>
          <button onClick={() => setActiveSection('section-3')} className={activeSection=="section-3"?"selected-btn":""}>Assigned Lead</button>
          <button onClick={() => setActiveSection('section-4')} className={activeSection=="section-4"?"selected-btn":""}>Follow Up</button>
          <button onClick={() => setActiveSection('section-5')} className={activeSection=="section-5"?"selected-btn":""}>Demo</button>
          <button onClick={() => setActiveSection('section-6')} className={activeSection=="section-6"?"selected-btn":""}>Visit</button>
          <button onClick={() => setActiveSection('section-7')} className={activeSection=="section-7"?"selected-btn":""}>Ringing</button>
          <button onClick={() => setActiveSection('section-8')} className={activeSection=="section-8"?"selected-btn":""}>Connected</button>
          <button onClick={() => setActiveSection('section-9')} className={activeSection=="section-9"?"selected-btn":""}>No Response</button>
          <button onClick={() => setActiveSection('section-10')} className={activeSection=="section-10"?"selected-btn":""}>Registered</button>
          <button onClick={() => setActiveSection('section-11')} className={activeSection=="section-11"?"selected-btn":""}>Not Joined</button>
          <button onClick={() => setActiveSection('section-12')} className={activeSection=="section-12 mt-2"?"selected-btn":"mt-2"}>Not Interested</button>
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

export default AdminPanel;
