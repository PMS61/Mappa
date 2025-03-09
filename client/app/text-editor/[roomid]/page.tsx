import { Room } from "../Room";
import { TextEditor } from "../TextEditor";

export default function Home({
  params,
}: {
  params: { roomid: string };
}) {
  return (
    <main>
      <Room
        roomid={params.roomid}
      >
        <TextEditor />
      </Room>
    </main>
  );
}
