import { COLORS } from '../../lib/constants.ts';

interface ColorPickerProps {
  onSelect: (color: string) => void;
  selectedColor?: string;
}

export default function ColorPicker({
  onSelect,
  selectedColor,
}: ColorPickerProps) {
  return (
    <div className="flex flex-wrap justify-start gap-3 border border-gray-400 rounded p-2 w-full">
      {COLORS.map((color) => (
        <div
          key={color}
          className={`w-5 h-5 rounded-full border border-gray-400 cursor-pointer ${
            selectedColor === color ? 'ring-1 ring-blue-500' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
