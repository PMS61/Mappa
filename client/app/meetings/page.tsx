"use client";
import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks,
    User,
  } from '@stream-io/video-react-sdk';
  
  import '@stream-io/video-react-sdk/dist/css/styles.css';
  import './style.css';
  
  const apiKey = 'mmhfdzb5evj2';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL01pc3Npb25fVmFvIiwidXNlcl9pZCI6Ik1pc3Npb25fVmFvIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDEzNzQ0NjAsImV4cCI6MTc0MTk3OTI2MH0.Yj3bkzUvMq4Fk25dwxSkpw_EZ1ZI2Qxlv9qCQ1mDKLQ';
  const userId = 'Mission_Vao';
  const callId = 'u62dw9SPqMq3';
  
  const user: User = {
    id: userId,
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
  };
  
  const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call('default', callId);
  call.join({ create: true });
  
  export default function App() {
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout />
        </StreamCall>
      </StreamVideo>
    );
  }
  
  export const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
  
    if (callingState !== CallingState.JOINED) {
      return <div>Loading...</div>;
    }
  
    return (
      <StreamTheme>
        <SpeakerLayout participantsBarPosition='bottom' />
        <CallControls />
      </StreamTheme>
    );
  };