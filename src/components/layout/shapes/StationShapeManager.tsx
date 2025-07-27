'use client'
import React from 'react';
import {getColorByOwner} from "@/components/layout/shapes/shape-color";

type Props = {
    render: string | null | undefined
    width: number;
    height: number;
    rx: number;
    owner: string;
    strokeWidth?: number; // <-- Add this
}

function StationShapeManager(props: Props) {


    if (props.render === "sliding") return (
        <>
            <rect
                width={props.width / 2}
                height={props.height}
                rx={props.rx}
                fill={"#89a7bc"}
            />
            <line
                x1={props.width / 2}
                y1={props.height + 10}
                x2={props.width / 2}
                y2={-props.height + 10}
                stroke="#89a7bc"
                strokeWidth={2}
            />
        </>
    );

    if (props.render === "ict") return (
        <>


            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={props.width - 20}
                y
            />

            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={5}
            />
            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={props.width - 20}
                y={props.height - 20}
            />

            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={5}
                y={props.height - 20}
            />

            <rect
                width={props.width}
                height={15}
                rx={props.rx}
                fill={"#89a7bc"}
                y={props.height / 2 - 7.5}
            />

        </>
    );


    // if (props.render === "ft_grid") return (
    //     <>
    //         {/* Generate cells in a 2x? grid based on total cells needed */}
    //         {(() => {
    //             // You can configure this based on your needs
    //             const totalCells = 24; // This could come from props or be calculated
    //             const rows = 2;
    //             const cols = Math.ceil(totalCells / rows); // Calculate columns needed
    //
    //             return Array.from({ length: totalCells }, (_, index) => {
    //                 const cellWidth = props.width / cols;
    //                 const cellHeight = props.height / rows;
    //
    //                 const row = Math.floor(index / cols);
    //                 const col = index % cols;
    //
    //                 const x = col * cellWidth;
    //                 const y = row * cellHeight;
    //
    //                 return (
    //                     <rect
    //                         key={index}
    //                         width={cellWidth}
    //                         height={cellHeight}
    //                         x={x}
    //                         y={y}
    //                         rx={props.rx}
    //                         fill={"#89a7bc"}
    //                         stroke="#fff"
    //                         strokeWidth={1}
    //                     />
    //                 );
    //             });
    //         })()}
    //     </>
    // );


    if (props.render === "ft_grid") return (
        <>
            {(() => {
                const totalCells = 24;
                const cellsPerRow = Math.ceil(totalCells / 2);
                const padding = 2;
                const middleRectHeight = 15;
                const cellGap = 10; // Small gap between cells and middle rectangle

                // Calculate cell dimensions
                const cellWidth = (props.width - (padding * (cellsPerRow + 1))) / cellsPerRow;
                const availableHeightPerRow = (props.height - middleRectHeight - (cellGap * 2)) / 2;
                const cellHeight = availableHeightPerRow - padding;

                // Position calculations
                const middleRectY = props.height / 2 - middleRectHeight / 2;
                const topRowY = middleRectY - cellGap - cellHeight;
                const bottomRowY = middleRectY + middleRectHeight + cellGap;

                return (
                    <>
                        {/* Top row cells */}
                        {Array.from({length: cellsPerRow}, (_, index) => {
                            const x = padding + index * (cellWidth + padding);

                            return (
                                <rect
                                    key={`top-${index}`}
                                    width={cellWidth}
                                    height={cellHeight}
                                    x={x}
                                    y={topRowY}
                                    rx={props.rx}
                                    fill={getColorByOwner(props.owner)}
                                    stroke="#fff"
                                    strokeWidth={0}
                                />
                            );
                        })}

                        {/* Middle horizontal rectangle (full width) */}
                        <rect
                            width={props.width}
                            height={middleRectHeight}
                            x={0}
                            y={middleRectY}
                            rx={props.rx}
                            fill={"#89a7bc"}
                            stroke="#fff"
                            strokeWidth={0}
                        />

                        {/* Bottom row cells */}
                        {Array.from({length: totalCells - cellsPerRow}, (_, index) => {
                            const x = padding + index * (cellWidth + padding);

                            return (
                                <rect
                                    key={`bottom-${index}`}
                                    width={cellWidth}
                                    height={cellHeight}
                                    x={x}
                                    y={bottomRowY}
                                    rx={props.rx}
                                    fill={getColorByOwner(props.owner)}
                                    stroke="#fff"
                                    strokeWidth={0}
                                />
                            );
                        })}
                    </>
                );
            })()}
        </>
    );

    if (props.render === "back_plate") return (
        <>


            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={5}
            />


            <rect
                width={15}
                height={20}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                x={5}
                y={props.height - 20}
            />

            <rect
                width={props.width}
                height={15}
                rx={props.rx}
                fill={"#89a7bc"}
                y={props.height / 2 - 7.5}
            />

        </>
    );


    return (
        <>
            <rect
                width={props.width}
                height={props.height}
                rx={props.rx}
                fill={getColorByOwner(props.owner)}
                stroke="#333"
                strokeWidth={props.strokeWidth ?? 0}
            />
        </>
    );
}

export default StationShapeManager;