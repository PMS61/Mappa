import { Room } from "./Room";
import { CollaborativeEditor } from "../components/CollaborativeEditor";

export default function Editor() {
  return (
    <div className="divmain">
      <Room>
        <CollaborativeEditor />
      </Room>
    </div>
  );
}
