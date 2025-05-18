import React from 'react';
import type { DiagramBlock, Connection } from '../../lib/types';

interface ImportExportControlsProps {
  blocks: DiagramBlock[];
  connections: Connection[];
  setBlocks: (blocks: DiagramBlock[]) => void;
  setConnections: (connections: Connection[]) => void;
}

export default function ImportExportControls({
  blocks,
  connections,
  setBlocks,
  setConnections,
}: ImportExportControlsProps) {
  const handleExport = () => {
    const data = JSON.stringify({ blocks, connections }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result as string);
        if (Array.isArray(result.blocks) && Array.isArray(result.connections)) {
          setBlocks(result.blocks);
          setConnections(result.connections);
        } else {
          alert('Invalid JSON structure.');
        }
      } catch {
        alert('Failed to parse JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 w-full text-sm text-gray-700">
      <button
        onClick={handleExport}
        className="bg-[#0072CE] text-white font-semibold px-6 py-2 rounded-md w-full hover:bg-[#005fa3] transition"
      >
        EXPORT JSON
      </button>
      <label className="block border-2 border-[#0072CE] text-[#0072CE] font-semibold text-center px-6 py-2 rounded-md cursor-pointer w-full hover:bg-blue-50 transition">
        IMPORT JSON
        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
