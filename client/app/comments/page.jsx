"use client";

import { RoomProvider } from "@/app/liveblocks.config.ts"; // Adjust the import path as needed
import Comments from "./Comments"; // Adjust the import path as needed
import { LiveblocksUIConfig } from "@liveblocks/react-ui";
import Cookies from "js-cookie";    

export default function CommentsPage() {
    const username = Cookies.get("username");
  return (
    <LiveblocksUIConfig
    overrides={{ locale: "en", USER_UNKNOWN: username?username:"Anonymous" /* ... */ }}
  >
    <RoomProvider
      id="liveblocks:examples:nextjs-yjs-codemirror
" // Replace with your actual room ID
      initialPresence={{}} // Add any initial presence data if needed
      initialStorage={{}} // Add any initial storage data if needed
    >
      <Comments />
    </RoomProvider>
    </LiveblocksUIConfig>
  );
}