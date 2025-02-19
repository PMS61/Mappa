"use client";

import { Room } from "./Room";
import { YjsTldraw } from "./YjsTldraw";

/**
 * IMPORTANT: LICENSE REQUIRED
 * To use tldraw commercially, you must first purchase a license
 * Learn more: https://tldraw.dev/community/license
 */

export default function Home() {
  return (
    <Room>
      <YjsTldraw />
    </Room>
  );
}
