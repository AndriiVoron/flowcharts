import DiagramCanvas from './components/diagram-canvas';
import './App.css';

function App() {
  return (
    <div className="flex items-start justify-bet">
      <aside>
        <div>EXPORT JSON</div>
        <div>IMPORT JSON</div>
        <div>COLOR PALETE</div>
      </aside>
      <main className="w-[80vw] h-[80vh] bg-gray-50">
        <DiagramCanvas />
      </main>
    </div>
  );
}

export default App;
