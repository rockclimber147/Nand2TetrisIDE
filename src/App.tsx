import { IDE } from "./components/IDE/IDE";
import { JackMonacoSpec } from "./core/Languages/Jack/JackMonacoSpec";

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <IDE languageSpec={JackMonacoSpec} title="Jack Compiler" />
    </div>
  );
}