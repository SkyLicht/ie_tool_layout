// 'use client'
//
// import React, {useState, useRef, useEffect} from "react";
// import layout from "../../../public/render/layout.json";
// import {Stations} from "@/components/layout/stations";
//
// export type DataCollector = {
//     name: string;
// } | null;
//
// export interface Station {
//     index: number;
//     name: string;
//     owner: string;
//     automatic?: boolean;
//     data_collector: DataCollector;
// }
//
// type SizeOption = "small" | "medium" | "normal" | "big";
//
// export default function Home() {
//     const [size, setSize] = useState<SizeOption>("normal");
//     const [pan, setPan] = useState<{ x: number; y: number }>({x: 0, y: 0});
//     const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
//         width: 1000, height: 480
//     });
//     const anchorSVG = useRef<{ x: number; y: number }>({x: 0, y: 0});
//     const dragging = useRef(false);
//     const containerRef = useRef<HTMLDivElement | null>(null);
//
//     // Responsive: observe parent div size
//     useEffect(() => {
//         if (!containerRef.current) return;
//         const handleResize = () => {
//             const {width, height} = containerRef.current!.getBoundingClientRect();
//             setContainerSize({width, height});
//         };
//         handleResize();
//
//         const observer = new (window as any).ResizeObserver(handleResize);
//         observer.observe(containerRef.current);
//
//         return () => observer.disconnect();
//     }, []);
//
//     // Mouse handlers for drag-to-pan
//     const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
//         dragging.current = true;
//         const svg = e.currentTarget;
//         const pt = svg.createSVGPoint();
//         pt.x = e.clientX;
//         pt.y = e.clientY;
//         const ctm = svg.getScreenCTM();
//         if (ctm) {
//             const inv = ctm.inverse();
//             const svgP = pt.matrixTransform(inv);
//             anchorSVG.current = {
//                 x: svgP.x - pan.x,
//                 y: svgP.y - pan.y
//             };
//         }
//     };
//     const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//         if (dragging.current) {
//             const svg = containerRef.current?.querySelector('svg');
//             if (!svg) return;
//
//             const pt = svg.createSVGPoint();
//             pt.x = e.clientX;
//             pt.y = e.clientY;
//             const ctm = svg.getScreenCTM();
//             if (ctm) {
//                 const inv = ctm.inverse();
//                 const svgP = pt.matrixTransform(inv);
//
//                 setPan({
//                     x: svgP.x - anchorSVG.current.x,
//                     y: svgP.y - anchorSVG.current.y,
//                 });
//             }
//         }
//     };
//     const onMouseUp = () => {
//         dragging.current = false;
//     };
//
//
//     const stations = layout.stations as Station[];
//
//
//     return (
//         <div
//             className=" h-screen w-full bg-gray-100 flex flex-col items-center p-2"
//             style={{userSelect: dragging.current ? "none" : "auto"}}
//             onMouseMove={onMouseMove}
//             onMouseUp={onMouseUp}
//             onMouseLeave={onMouseUp}
//         >
//              Controls
//             <div className="flex flex-row items-center gap-4 w-[340px] border-2 border-black">
//                 <div className="flex flex-col flex-1">
//                     <label className="text-sm font-bold text-gray-700 flex justify-between mb-2">
//                         <span>View size</span>
//                     </label>
//                     <select
//                         value={size}
//                         onChange={e => setSize(e.target.value as SizeOption)}
//                         className="w-full px-2 py-1 rounded border border-gray-300"
//                     >
//                         <option value="small">Small</option>
//                         <option value="medium">Medium</option>
//                         <option value="normal">Normal</option>
//                         <option value="big">Big</option>
//                     </select>
//                 </div>
//                 <button
//                     className="px-3 py-1 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
//                     onClick={() => {
//                         setPan({x: 0, y: 0});
//                         // setSelected(null);
//                     }}
//                     type="button"
//                     title="Reset layout"
//                 >
//                     Reset
//                 </button>
//             </div>
//
//
//
//             {/* SVG Responsive Container */}
//             <div
//                 ref={containerRef}
//                 className="w-full h-full overflow-auto flex items-center justify-center"
//                 style={{cursor: dragging.current ? "grabbing" : "grab"}}
//             >
//                 <svg
//                     width="100%"
//                     height="100%"
//                     viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
//
//                     style={{
//                         transition: "width 0.3s, height 0.3s",
//                         display: "block",
//                         // border: "2px solid #333",
//                         borderRadius: "1rem",
//                         background: "#fff"
//                     }}
//                     onMouseDown={onMouseDown}
//                     preserveAspectRatio="xMinYMin meet"
//                 >
//                     <g
//                         transform={`translate(${pan.x},${pan.y})`}
//                         style={{transition: "transform 0.2s"}}
//                     >
//                         <Stations
//                             stations={stations}
//                             size={size}
//                             onSelect={() => {
//                                 console.log("dsadsadsf")
//                             }}
//                         />
//                     </g>
//                 </svg>
//             </div>
//         </div>
//     );
// }