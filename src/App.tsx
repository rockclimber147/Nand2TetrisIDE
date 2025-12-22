import { IDE } from "./components/IDE/IDE";
import { JackMonacoSpec } from "./core/Languages/Jack/JackMonacoSpec";
import { JackDriver } from "./core/Languages/Jack/JackDriver";

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <IDE languageSpec={JackMonacoSpec} driver={new JackDriver()} title="Jack Compiler" />
    </div>
  );
}