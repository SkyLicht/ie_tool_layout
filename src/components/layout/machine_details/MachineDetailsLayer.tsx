import React from 'react';
import {X} from "lucide-react";

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

type Props = {
    station: Station | null ;
    onClose: () => void;
}


function MachineDetailsLayer(props: Props) {
    return (
        <div className={'absolute w-full h-full cursor-pointer bg-black/20  flex justify-end'} onClick={e => {

            props.onClose()

        }}
        >

            <div onClick={e => {
                e.stopPropagation();
            }}
                 className={'w-1/3 h-full z-20 bg-white flex flex-col items-center p-2'}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">{props.station.name}</h2>
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MachineDetailsLayer;