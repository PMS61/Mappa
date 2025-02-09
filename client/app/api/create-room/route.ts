import { NextRequest } from "next/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const { fileName } = await request.json();
  const roomId = `liveblocks:examples:${fileName}`;

  // Create a session for the new room
  const session = liveblocks.prepareSession(roomId, {
    userInfo: { name: "system", color: "#000000" },
  });

  session.allow(roomId, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new Response(JSON.stringify({ roomId }), { status });
}
