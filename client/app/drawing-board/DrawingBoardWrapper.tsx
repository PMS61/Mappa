"use client";

import { Room } from "./Room";
import { YjsTldraw } from "./YjsTldraw";

export function DrawingBoardWrapper({ roomId }: { roomId: string }) {
  return (
    <Room roomid={roomId}>
      <YjsTldraw />
    </Room>
  );
}
