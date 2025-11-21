import React, { useState, useEffect } from 'react';
import './Profile.css';
import Chat from './Chat';
import AddFeedback from './AddFeedback';
import UserHistory from './UserHistory';
import { GetUser } from '../api/allApi';
import Logout from './Logout';
import { ref as createStorageRef, uploadBytes } from "firebase/storage";
import { get, ref, update } from 'firebase/database';
import { database, storage } from '../api/firebase';

function Profile() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [activesection, setactivesection] = useState('profile');
  const [user, setuser]=useState(null)

  const uname = sessionStorage.getItem('username')
  
  
  useEffect(() => {
    
      fetchUserDetails();
    },[]);

  

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };


  const handleCheckCurrency = async() => {
    setLoading(true);

    try {
      const imgRef = createStorageRef(storage, `LiveImage2/img.jpg`);
      await uploadBytes(imgRef, image);            
      const dbRef = ref(database,"LiveImage2");
      await update(dbRef, {uploadFlag:'1'});
   
      setLoading(false)

      let conditionMet = false;
      const timeout = 30000; 
      const startTime = Date.now();

      try {
        while (!conditionMet) {
          const currentTime = Date.now();
        
          if (currentTime - startTime > timeout) {
            console.log("Timeout exceeded, stopping the loop.")
            break;
            
          }

          const dbRef = ref(database, `LiveImage2/resultFlag`);
          const snapshot = await get(dbRef);
          const data = snapshot.val();

          if (data === "1") {
            conditionMet = true;
            const deseas = ref(database, `LiveImage2/result`);
            const des = await get(deseas);
            const  data= des.val();
           
            generateSpeech(data.result)
            setResult(data.result)
            await update(dbRef,{resultFlag:'0'})
            setLoading(false)
          
          } else {

           console.log("Condition not met, retrying...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); 
          }
        }

        if (!conditionMet) {
          await update(flag, {uploadFlag:'0'});
          console.log ("server error please try again");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setLoading(false)
       
      }

  } catch (error) {
    
    setLoading(false)
  }
    
  };

  const generateSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };



  const fetchUserDetails = () => {
    GetUser().then(res => {
      const filterUser = res.data.find(user => user.username === uname);
  
      
      if (filterUser) {
        setuser(filterUser);
      }
    });
  };
  
  

  return (
    <div className="profile-container" >
      <aside className="profile-sidebar">
        <div className="user-heading">
          <h1>{user ? user.username:''}</h1>
          <p style={{fontSize:'13px'}}>{user ? user.email : "Loading..."}</p>
        </div>

        <ul className="nav flex-column">
          <li>
            <a href="#" className={activesection === "profile" ? "active" : ""} onClick={() => setactivesection("profile")}>
              <i className="fa fa-user"></i> Profile
            </a>
          </li>
          <li>
            <a href="#" className={activesection === "detect" ? "active" : ""} onClick={() => setactivesection("detect")}>
              <i className="fa fa-search"></i> Verify Currency
            </a>
          </li>
          <li>
            <a href="#" className={activesection === "chat" ? "active" : ""} onClick={() => setactivesection("chat")}>
              <i className="fa fa-comments"></i> Chat
            </a>
          </li>
          <li>
            <a href="#" className={activesection === "addfeedback" ? "active" : ""} onClick={() => setactivesection("addfeedback")}>
              <i className="fa fa-comment-alt"></i> Add Feedback
            </a>
          </li>
          <li>
            <a href="#" className={activesection === "history" ? "active" : ""} onClick={() => setactivesection("history")}>
              <i className="fa fa-history"></i> Fake Currency History
            </a>
          </li>
          <li>
            <Logout/>
          </li>
        </ul>
      </aside>

      <main className="profile-content" >
       

        {activesection === 'profile' && (
          
          <div className="d-flex flex-column align-items-center text-center bg-dark text-white p-5" style={{ minHeight: '100vh' }}>
          <div className="bio-graph-heading bg-warning text-dark p-4 rounded shadow-lg w-75">
            <h5 className="fw-bold">Reliable Fake Currency Detection for Secure Transactions</h5>
            <p><i>Advanced fake currency detection ensures secure transactions with real-time accuracy.</i></p>
          </div>
          <div className="panel-body w-75 mt-5 p-4 border rounded shadow-lg bg-secondary text-white">
            <h2 className="text-center"><i>Profile Information</i></h2>
            <div className="profile-details p-4 border rounded shadow-sm bg-dark">
              <div className="row text-start">
                <div className="col-md-6"><p><strong>Name:</strong> {user ? user.username:''}</p></div>
                <div className="col-md-6"><p><strong>Email:</strong> {user ? user.email : "Loading..."}</p></div>
              </div>
              <div className="row text-start">
                <div className="col-md-6"><p><strong>Mobile:</strong> 03 4567890</p></div>
                <div className="col-md-6"><p><strong>Location:</strong> {user ? user.location.name : "Loading..."}</p></div>
              </div>
            </div>
          </div>
          
         
          
          <div className="fake-currency-info w-75 mt-4 p-4 border rounded shadow-lg bg-light text-white">
            <h3 className="text-center"><i>What to Do If You Receive Fake Currency?</i></h3>
            <ul className="text-left">
              <li>Do not attempt to use the fake currency.</li>
              <li>Immediately report it to the nearest bank or law enforcement agency.</li>
              <li>Take note of the person who gave you the fake note if possible.</li>
              <li>Handle the note carefully to preserve any evidence.</li>
              <li>Use our AI-powered verification tool to check the authenticity of your notes.</li>
            </ul>
          </div>
        </div>
        )}

        {activesection === 'detect' && (
          <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className="currency-verification w-75   mt-4 p-4  text-white text-center">
            <h3><i>Currency Verification</i></h3>
            <input type="file" className="form-control my-3" accept="image/*" onChange={handleImageUpload} />
            <button className="btn btn-primary px-4 py-2 w-100" onClick={handleCheckCurrency} disabled={!image || loading}>
              {loading ? "Checking..." : "Upload & Verify"}
            </button>
            {result && <p className={`mt-3 fw-bold ${result.includes("Fake") ? "text-danger" : "text-success"}`}>{result}</p>}
          </div>
          </div>
        )}

        {activesection === 'chat' && (
          <div className="chat-section mt-5 p-2">
            <Chat />
          </div>
        )}

{activesection === 'addfeedback' && (
          <div >
            <AddFeedback />
          </div>
        )}

{activesection === 'history' && (
          <div >
            <UserHistory />
          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;
