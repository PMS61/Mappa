import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  // Retrieve the username from cookies
  const cookieStore = cookies();
  const uname = cookieStore.get('username')?.value || 'Default Name';

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(uname, {
    userInfo: {
      name: uname,
      color: "#D583F0",
      picture: "https://liveblocks.io/avatars/avatar-1.png",
    },
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
