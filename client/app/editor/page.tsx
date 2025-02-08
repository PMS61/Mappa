import { Room } from "./Room";
import { CollaborativeEditor } from "../components/CollaborativeEditor";

export default function Home() {
  return (
    <main>
      <Room>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}
