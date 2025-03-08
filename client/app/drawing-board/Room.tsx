"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { LiveMap } from "@liveblocks/core";
import { Loading } from "./Loading";

export function Room({ children, roomid }: { children: ReactNode, roomid: string }) {
  // const finalRoomId = useExampleRoomId(
  //   "liveblocks:examples:nextjs-tldraw-whiteboard-yjs"
  // );
  const finalRoomId = useExampleRoomId(roomid)

  return (
    <RoomProvider
      id={finalRoomId}
      initialPresence={{ presence: undefined }}
      initialStorage={{ records: new LiveMap() }}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
  const params = useSearchParams();
  const exampleId = params?.get("exampleId");

  const exampleRoomId = useMemo(() => {
    return exampleId ? `${roomId}-${exampleId}` : roomId;
  }, [roomId, exampleId]);

  return exampleRoomId;
}
