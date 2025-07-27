'use client'
import React from 'react';
import LayoutCanvas from "@/components/layout/LayoutCanvas";
import {useLineHeader} from "@/hook/use-line-header";
import {useWebSocketMonitor} from "@/hook/use-data-collector-socket";




function MatrixLayout() {


// Update your WebSocket monitor hook to handle both message types
    const {currentHourSummary,connectionStatus, error, reconnect} = useWebSocketMonitor(
        'ws://localhost:9091/ws/monitor',
        {
            onMessage: (message) => {

            },
            onConnect: () => {
                console.log('WebSocket connected');
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
            }
        }
    );



    return (
        <div
            className={"h-full w-full bg-[#eff0f3] flex flex-col items-center p-2"}
        >

            <section className={"h-3/5 w-full "}>
                <LayoutCanvas currentHourSummary={currentHourSummary}/>
            </section>
            <section className={"h-2/5 border-black border-2 w-full flex flex-row justify-between "}>
                {/*WebSocket status indicator */}
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            connectionStatus === 'connected' ? 'bg-green-500' :
                                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                                    'bg-red-500'
                        }`}
                        title={`WebSocket: ${connectionStatus}`}
                    />
                    {connectionStatus === 'error' && (
                        <button
                            onClick={reconnect}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            title="Reconnect WebSocket"
                        >
                            Reconnect
                        </button>
                    )}
                </div>
                <LineHeaders/>
            </section>

        </div>
    );
}

function LineHeaders() {

    const header = useLineHeader()
    return (
        <div className={" h-full flex flex-col i text-neutral-900 border border-black"}>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-xl"}>Line</h3>
                <h3 className={"font-semibold text-xl"}>J01</h3>
            </div>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-2xl"}>Model</h3>
                <h3 className={"font-bold text-xl"}>LUXOR</h3>
            </div>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-2xl"}>SKU</h3>
                <h3 className={"font-bold text-xl"}>Y0MMY</h3>
            </div>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-2xl"}>UPH</h3>
                <h3 className={"font-bold text-xl"}>195</h3>
            </div>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-2xl"}>OEE</h3>
                <h3 className={"font-bold text-xl"}>65%</h3>
            </div>
            <div className={"flex flex-row gap-4"}>
                <h3 className={"text-2xl"}>PH</h3>
                <h3 className={"font-bold text-xl"}>15.5h</h3>
            </div>
        </div>
    )
}

export default MatrixLayout;