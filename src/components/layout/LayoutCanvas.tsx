'use client'

import React, {useState, useRef} from "react";
import layout from "../../../public/render/layout.json";
import {Stations} from "@/components/layout/Stations";
import MachineDetailsLayer from "@/components/layout/machine_details/MachineDetailsLayer";
import {SummaryLines} from "@/data/decoder/decoder-summary-update";
import {RenderLineLabel} from "@/components/layout/live_data/LineLabel";


export type DataCollector = {
    name: string;
} | null;

export interface Station {
    index: number;
    name: string;
    owner: string;
    automatic?: boolean;
    data_collector: DataCollector;
}

interface Line {
    smt: Station[]
    pth: Station[]
}

export interface Lines {
    J01: Line,
    J02: Line,
    J03: Line,
    J05: Line,
    J06: Line,
    J07: Line,
    J08: Line,
    J09: Line,
    J10: Line,
    J11: Line
}

type SizeOption = "small" | "medium" | "normal" | "big";

interface LayoutCanvasProps {
    currentHourSummary: SummaryLines;
}

export default function LayoutCanvas(props: LayoutCanvasProps) {
    const [size, setSize] = useState<SizeOption>("small");
    const [pan, setPan] = useState<{ x: number; y: number }>({x: 0, y: 0});
    const anchorSVG = useRef<{ x: number; y: number }>({x: 0, y: 0});
    const dragging = useRef(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Popup state with position
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);


    // Mouse handlers for drag-to-pan
    const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        dragging.current = true;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (ctm) {
            const inv = ctm.inverse();
            const svgP = pt.matrixTransform(inv);
            anchorSVG.current = {
                x: svgP.x - pan.x,
                y: svgP.y - pan.y
            };
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragging.current) {
            const svg = containerRef.current?.querySelector('svg');
            if (!svg) return;

            const pt = svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const ctm = svg.getScreenCTM();
            if (ctm) {
                const inv = ctm.inverse();
                const svgP = pt.matrixTransform(inv);

                setPan({
                    x: svgP.x - anchorSVG.current.x,
                    y: svgP.y - anchorSVG.current.y,
                });
            }
        }
    };

    const onMouseUp = () => {
        dragging.current = false;
    };

    const lines = layout as Lines;

    // Updated station select handler with position tracking
    const handleStationSelect = (station: Station, event?: React.MouseEvent) => {
        setSelectedStation(station);
        setIsPopupOpen(true);
    };

    // Close popup function
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedStation(null);
    };

    const drawLines = () => {

        type line_position = {
            line_id: string,
            x: number,
            y: number,
            width: number,
            height: number,
        }


        const lines = [
            "J01",
            "J02",
            "J03",
            "J05",
            "J06",
            "J07",
            "J08",
            "J09",
            "J10",
            "J11",
        ]


        return lines.map((line, index) => {
            const line_position: line_position = {
                line_id: "",
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }

            line_position.line_id = line
            line_position.x = 0
            line_position.y = index * 500
            line_position.width = 1520
            line_position.height = 500

            return line_position
        })
    }
    return (
        <div
            className="relative h-full w-full  flex flex-col items-center "
            style={{userSelect: dragging.current ? "none" : "auto"}}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {/*<div className="flex flex-row items-center gap-4 w-[340px] border-2 border-black">*/}
            {/*    <div className="flex flex-col flex-1">*/}
            {/*        <select*/}
            {/*            value={size}*/}
            {/*            onChange={e => setSize(e.target.value as SizeOption)}*/}
            {/*            className="w-full px-2 py-1 rounded border border-gray-300"*/}
            {/*        >*/}
            {/*            <option value="small">Small</option>*/}
            {/*            <option value="medium">Medium</option>*/}
            {/*            <option value="normal">Normal</option>*/}
            {/*            <option value="big">Big</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <button*/}
            {/*        className="px-3 py-1 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"*/}
            {/*        onClick={() => setPan({x: 0, y: 0})}*/}
            {/*        type="button"*/}
            {/*        title="Reset layout"*/}
            {/*    >*/}
            {/*        Reset*/}
            {/*    </button>*/}
            {/*</div>*/}


            {/* SVG Responsive Container */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-auto flex items-center justify-center relative"
                style={{cursor: dragging.current ? "grabbing" : "grab"}}
            >
                <svg
                    width="100%"
                    height="100%"
                    style={{
                        transition: "width 0.3s, height 0.3s",
                        display: "block",
                        // borderRadius: "1rem",
                        background: "#eff0f3"
                    }}
                    onMouseDown={onMouseDown}
                    preserveAspectRatio="xMinYMin meet"
                >
                    <g
                        transform={`translate(${pan.x},${pan.y})`}
                        style={{transition: "transform 0.2s"}}
                    >

                        {drawLines().map((line, index) => (
                            <>
                                <rect
                                    key={`line-${line.y}-${index}`}
                                    x={line.x}
                                    y={line.y}
                                    width={line.width}
                                    height={line.height}
                                    fill="none"
                                    stroke={"#003153"}
                                    strokeWidth={0}
                                    rx={3}
                                />

                                <RenderLineLabel label={line.line_id} x={line.x} y={line.y}/>

                                <Stations
                                    groups={props.currentHourSummary[line.line_id]}
                                    stations={lines[line.line_id].smt}
                                    size={size}
                                    onSelect={() => {
                                        console.log("dsadsadsf")
                                    }}
                                    offsetX={line.x}
                                    offsetY={line.y + 50}
                                />
                                <Stations
                                    groups={props.currentHourSummary[line.line_id]}
                                    stations={lines[line.line_id].pth}
                                    size={size}
                                    onSelect={() => {
                                        console.log("dsadsadsf")
                                    }}
                                    offsetX={line.x + 250}
                                    offsetY={line.y + 250}
                                />

                            </>
                        ))}

                    </g>
                </svg>
            </div>

            {isPopupOpen && (
                <MachineDetailsLayer
                    station={selectedStation}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
}