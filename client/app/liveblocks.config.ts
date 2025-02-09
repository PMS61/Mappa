import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

type UserInfo = {
  name: string;
  color: string;
  picture: string;
};

export type UserAwareness = {
  user?: UserInfo;
};

export type AwarenessList = [number, UserAwareness][];

declare global {
  interface Liveblocks {
    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string; // Accessible through `user.id`
      info: UserInfo; // Accessible through `user.info`
    };
  }
}

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Presence represents the public state that will be shared with other users
type Presence = {
  // Add your presence properties here
};

// Storage represents the public database that will be shared with other users
type Storage = {
  // Add your storage properties here
};

// Define threads type for comments
type ThreadMetadata = {
  resolved: boolean;
};

export const {
  RoomProvider,
  useThreads,
  useCreateThread,
  useThread,
  useEditThreadMetadata,
  /* ...other hooks */
} = createRoomContext<Presence, Storage, UserMeta, ThreadMetadata>(client);