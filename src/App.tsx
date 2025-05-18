import { useState } from 'react';
import DiagramCanvas from './components/diagram-canvas';
import ImportExportControls from './components/import-export';
import ColorPicker from './components/color-picker';
import { DIAGRAME_BASE } from './lib/init-state';
import type { DiagramBlock, Connection } from './lib/types';

function App() {
  const [blocks, setBlocks] = useState<DiagramBlock[]>(DIAGRAME_BASE);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setBlocks((prev) => prev.map((block) => ({ ...block, fill: color })));
  };

  return (
    <div>
      <div className="p-4 border-b border-b-gray-400">
        <h2>FLOWCHARTS</h2>
      </div>
      <div className="flex items-start">
        <aside className="flex flex-col items-start justify-start p-4 space-y-4 text-sm text-gray-700 max-w-[30vw] w-[30vw]">
          <ImportExportControls
            blocks={blocks}
            connections={connections}
            setBlocks={setBlocks}
            setConnections={setConnections}
          />
          <ColorPicker
            selectedColor={selectedColor}
            onSelect={handleColorSelect}
          />
        </aside>
        <main className="max-w-[70vw] w-[70vw] border-l border-l-gray-500">
          <DiagramCanvas
            blocks={blocks}
            setBlocks={setBlocks}
            connections={connections}
            setConnections={setConnections}
            width={700}
            height={800}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
