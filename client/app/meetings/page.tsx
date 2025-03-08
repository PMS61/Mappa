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
import Cookies from 'js-cookie';
  
  const apiKey = 'gdywtu7uj286';
  const callId = 'default_6c43dfc9-5938-46f0-a7c8-fe2ad7e39c84';
  
  const username = Cookies.get('username') || 'default-username';

  const user: User = {
    name: username,
    id: "jack-guest",
    type: "guest",
  };
  
  const client = new StreamVideoClient({ apiKey, user });
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