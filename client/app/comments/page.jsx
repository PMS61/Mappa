"use client";

import { RoomProvider } from "@/app/liveblocks.config.ts"; // Adjust the import path as needed
import Comments from "./Comments"; // Adjust the import path as needed

export default function CommentsPage() {
  return (
    <RoomProvider
      id="liveblocks:examples:nextjs-yjs-codemirror
" // Replace with your actual room ID
      initialPresence={{}} // Add any initial presence data if needed
      initialStorage={{}} // Add any initial storage data if needed
    >
      <Comments />
    </RoomProvider>
  );
}