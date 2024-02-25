import React, {useEffect, useRef} from 'react'
import CodeEditor from '../components/CodeEditor'
import Compiler from '../components/Compiler'
import { Container, Grid, Paper, Box, Typography, Button } from '@mui/material'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAip3Pc5399-6_AvpnnZkx401fKTfRILk4",
  authDomain: "webrtc-24aeb.firebaseapp.com",
  projectId: "webrtc-24aeb",
  storageBucket: "webrtc-24aeb.appspot.com",
  messagingSenderId: "1010546974131",
  appId: "1:1010546974131:web:d1f4ea2aafc87988433fc6",
  measurementId: "G-X7HLXGNHKG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;



    const webcamButton = document.getElementById('webcamButton');
    const webcamVideo = document.getElementById('webcamVideo');
    const callButton = document.getElementById('callButton');
    const callInput = document.getElementById('callInput');
    const answerButton = document.getElementById('answerButton');
    const remoteVideo = document.getElementById('remoteVideo');
    const hangupButton = document.getElementById('hangupButton');
    
    // 1. Setup media sources
    if(webcamButton){
      webcamButton.onclick = async () => {
        console.log('Clicked')
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        remoteStream = new MediaStream();
      
        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      
        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };
        
    
        webcamVideo.srcObject = localStream;
        remoteVideo.srcObject = remoteStream;
      
        callButton.disabled = false;
        answerButton.disabled = false;
        webcamButton.disabled = true;
      };
    }

    const startCam = () => {
        document.getElementById('webcamButton').onclick = async () => {
            console.log('Clicked')
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            remoteStream = new MediaStream();
          
            // Push tracks from local stream to peer connection
            localStream.getTracks().forEach((track) => {
              pc.addTrack(track, localStream);
            });
          
            // Pull tracks from remote stream, add to video stream
            pc.ontrack = (event) => {
              event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
              });
            };
            
        
            document.getElementById('webcamVideo').srcObject = localStream;

            if(document.getElementById('remoteVideo')){
                document.getElementById('remoteVideo').srcObject = remoteStream;
            }
          
            if(document.getElementById('callButton')){
                document.getElementById('callButton').disabled = false;
            }
        if(document.getElementById('answerButton')){
            document.getElementById('answerButton').disabled = false;
        }
        if(document.getElementById('webcamButton')){

            document.getElementById('webcamButton').disabled = true;
        }
    }
}

    // 2. Create an offer
    if(callButton){
      callButton.onclick = async () => {
        // Reference Firestore collections for signaling
        const callDoc = firestore.collection('calls').doc();
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');
      
        callInput.value = callDoc.id;
      
        // Get candidates for caller, save to db
        pc.onicecandidate = (event) => {
          event.candidate && offerCandidates.add(event.candidate.toJSON());
        };
      
        // Create offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
      
        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };
      
        await callDoc.set({ offer });
      
        // Listen for remote answer
        callDoc.onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDescription);
          }
        });
      
        // When answered, add candidate to peer connection
        answerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.addIceCandidate(candidate);
            }
          });
        });
      
        hangupButton.disabled = false;
      };
    }

    
    // 3. Answer the call with the unique ID
    if(answerButton){
      answerButton.onclick = async () => {
        console.log("Ans Clicked")
        const callId = callInput.value;
        const callDoc = firestore.collection('calls').doc(callId);
        const answerCandidates = callDoc.collection('answerCandidates');
        const offerCandidates = callDoc.collection('offerCandidates');
      
        pc.onicecandidate = (event) => {
          event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
      
        const callData = (await callDoc.get()).data();
      
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
      
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
      
        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
      
        await callDoc.update({ answer });
      
        offerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            console.log(change);
            if (change.type === 'added') {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      };
    }

    const ansCall = () => {
        console.log("Ans Clicked")
        const callId = callInput.value;
        const callDoc = firestore.collection('calls').doc(callId);
        const answerCandidates = callDoc.collection('answerCandidates');
        const offerCandidates = callDoc.collection('offerCandidates');
      
        pc.onicecandidate = (event) => {
          event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
      
        const callData = ( callDoc.get()).data();
      
        const offerDescription = callData.offer;
         pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
      
        const answerDescription =  pc.createAnswer();
         pc.setLocalDescription(answerDescription);
      
        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
      
         callDoc.update({ answer });
      
        offerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            console.log(change);
            if (change.type === 'added') {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
}

    console.log('getUserMedia' in navigator.mediaDevices);



function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const Meeting = () => {

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
  };

  return (
    <Container maxWidth='xl'>
    <Grid container mt={7}>
        <Grid item md={8}>
        <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Editor" {...a11yProps(1)} />
          <Tab label="Canvas" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Description
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Compiler/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Canvas
      </CustomTabPanel>
    </Box>
        </Grid>
        <Grid item md={4} >
            <Paper sx={{height:'300px', margin:'10px 10px', backgroundColor:'#EEEDEB'}}>
            <Button onClick={startCam} id="webcamButton">Start webcam</Button>
            <input id="callInput" />
            <button onClick={ansCall} id="answerButton" disabled>Answer</button>
            <button id="hangupButton" disabled>Hangup</button>
            </Paper>
            <Paper sx={{height:'300px', margin:'70px 10px 0 10px', backgroundColor:'#EEEDEB'}}>
                <div id="webcamVideo">

                </div>
            </Paper>
        </Grid>
    </Grid>
    </Container>
  )
}

export default Meeting