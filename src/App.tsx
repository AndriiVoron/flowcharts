import { useState } from 'react';
import ImportExportControls from './components/import-export';
import DiagramCanvas from './components/diagram-canvas';
import './index.css';
import { DIAGRAME_BASE } from './components/diagram-canvas/constants';
import type { DiagramBlock, Connection } from './store/types';

function App() {
  const [blocks, setBlocks] = useState<DiagramBlock[]>(DIAGRAME_BASE);
  const [connections, setConnections] = useState<Connection[]>([]);

  return (
    <div>
      <div className="p-4 border-b border-b-gray-400">
        <h2>FLOWCHARTS</h2>
      </div>
      <div className="flex items-start">
        <aside className="flex flex-col items-start justify-start p-4  space-y-4 text-sm text-gray-700 min-w-[30vw] max-w-[30vw] w-[30vw]">
          <ImportExportControls
            blocks={blocks}
            setBlocks={setBlocks}
            connections={connections}
            setConnections={setConnections}
          />
          {/* <ColorPalete /> */}
          <div className="text-red-700">COLOR PALETE</div>
        </aside>
        <main className="flex-shrink-0 w-[70vw] h-[600px] border-l border-l-gray-500 bg-gray-50 overflow-hidden">
          <DiagramCanvas
            blocks={blocks}
            setBlocks={setBlocks}
            connections={connections}
            setConnections={setConnections}
            width={700}
            height={600}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
