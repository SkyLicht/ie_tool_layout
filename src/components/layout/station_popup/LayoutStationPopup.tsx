import { X } from 'lucide-react';

interface Station {
  index: number;
  name: string;
  owner: string;
  automatic?: boolean;
  data_collector?: {
    name: string;
  } | null;
  render_type?: string | null;
  operators?: Array<{
    render: string;
    bound: string;
  }>;
}

interface LayoutStationPopupProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function LayoutStationPopup({ station, isOpen, onClose, position }: LayoutStationPopupProps) {
  if (!isOpen || !station) return null;

  // Calculate popup position to avoid going off-screen
  const popupStyle = {
    position: 'absolute' as const,
    left: `${position.x + 10}px`, // Add small offset from cursor
    top: `${position.y - 10}px`,
    transform: 'translateY(-100%)', // Position above the cursor
    zIndex: 1000,
  };

  return (
    <div 
      style={popupStyle}
      className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{station.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Station Information */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Index:</span>
          <span className="text-gray-800">{station.index}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Owner:</span>
          <span className="text-gray-800">{station.owner}</span>
        </div>

        {station.render_type && (
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Type:</span>
            <span className="text-gray-800 capitalize">
              {station.render_type.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Mode:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            station.automatic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {station.automatic ? 'Automatic' : 'Manual'}
          </span>
        </div>

        {station.data_collector && (
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Data Collector:</span>
            <span className="text-gray-800">{station.data_collector.name}</span>
          </div>
        )}

        {station.operators && station.operators.length > 0 && (
          <div>
            <span className="font-medium text-gray-600 block mb-1">Operators:</span>
            <div className="space-y-1">
              {station.operators.map((operator, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-500 capitalize">{operator.render}:</span>
                  <span className="text-gray-700">{operator.bound}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}