import "./components/coverflow.css";
import Coverflow from "./components/Coverflow";


export default function ArchPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Architectural Visualization
      </h1>
      <Coverflow />
    </section>
  );
}
