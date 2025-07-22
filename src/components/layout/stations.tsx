import React from "react";


type SizeOption = "small" | "medium" | "normal" | "big";


interface StationsProps {
    stations: Station[];
    size: SizeOption;
    onSelect: (st: Station) => void;
}

type RenderType =
    "default"
    | "conveyor"
    | "panasonic_npm"
    | "loader"
    | "buffer_ng"
    | "fuzion"
    | "reflow_oven"
    | "pallet"; // add more as you grow

type Station = {
    index: number;
    name: string;
    owner: string;
    automatic?: boolean;
    data_collector?: { name: string };
    render_type?: RenderType | null;
    operator: {
        render: string,
        bound: string
    }
};

type ShapeProps = {
    width: number;
    height: number;
    rx: number;
    fontSize: number;
};

function getStationShape(size: SizeOption, renderType: RenderType | null | undefined): ShapeProps {
    if (size === "small") {
        // In "small", conveyors are smaller
        if (renderType === "conveyor") {
            return {width: 15, height: 15, rx: 0, fontSize: 0};
        }

        if (renderType === "panasonic_npm") {
            return {width: 30, height: 35, rx: 0, fontSize: 0};
        }

        if (renderType === "loader") {
            return {width: 15, height: 35, rx: 0, fontSize: 0};
        }

        if (renderType === "buffer_ng") {
            return {width: 20, height: 30, rx: 0, fontSize: 0};
        }

        if (renderType === "fuzion") {
            return {width: 40, height: 30, rx: 0, fontSize: 0};
        }

        if (renderType === "reflow_oven") {
            return {width: 100, height: 30, rx: 0, fontSize: 0};
        }

        if (renderType === "pallet") {
            return {width: 30, height: 30, rx: 0, fontSize: 0};
        }
        // Default shape for small
        return {width: 30, height: 30, rx: 0, fontSize: 0};
    }
    // You can add custom logic per render type and size
    if (size === "medium") {
        return {width: 45, height: 45, rx: 8, fontSize: 11};
    }
    if (size === "normal") {
        return {width: 70, height: 70, rx: 12, fontSize: 16};
    }
    return {width: 100, height: 100, rx: 16, fontSize: 20};
}


export const Stations: React.FC<StationsProps> = ({
                                                      stations,
                                                      size,
                                                      onSelect
                                                  }) => {


    const shapes = stations.map(st => getStationShape(size, st.render_type || null));
    const widths = shapes.map(shape => shape.width);
    const gap = 2; // or your chosen gap

    const xCenters: number[] = [];
    const centerY = 100; // This is the y where you want all centers aligned
    let x = 20 + widths[0] / 2; // Start with half the first width as center
    xCenters.push(x);

    for (let i = 1; i < widths.length; i++) {
        x += (widths[i - 1] / 2) + gap + (widths[i] / 2);
        xCenters.push(x);
    }


    // 1. Flatten operator assignments
    type OperatorAssignment = { i: number; operator: { render: "front" | "rear"; bound: string } };
    const operatorAssignments: OperatorAssignment[] = [];
    stations.forEach((st, i) => {
        if (Array.isArray(st.operators)) {
            st.operators.forEach(op => {
                operatorAssignments.push({i, operator: op});
            });
        }
    });

    // 2. Group by 'bound'
    const operatorGroups: Record<string, OperatorAssignment[]> = {};
    operatorAssignments.forEach(({i, operator}) => {
        if (!operatorGroups[operator.bound]) operatorGroups[operator.bound] = [];
        operatorGroups[operator.bound].push({i, operator});
    });

    return (
        <g>
            {stations.map((st, i) => {
                    const shape = shapes[i];
                    const x = xCenters[i];
                    const y = centerY - (shape.height / 2);
                    return (
                        <g
                            key={i}
                            transform={`translate(${x - shape.width / 2}, ${y})`}
                            onClick={e => {
                                onSelect(st);
                                e.stopPropagation();
                            }}
                            style={{cursor: "pointer"}}
                            fill="#1d1d1d"
                        >

                            <rect
                                width={shape.width}
                                height={shape.height}
                                rx={shape.rx}
                                fill={st.owner === "Automation" ? "#c7f0d8" : "#a5c8e1"}
                                stroke="#333"
                                strokeWidth={0}
                            />
                            {size === "small" && st.data_collector && (
                                <>
                                    {/* Dashed line from label to data collector rect */}
                                    <line
                                        x1={shape.width / 2}
                                        y1={-35}
                                        x2={shape.width / 2}
                                        y2={-5}
                                        stroke="#888"
                                        strokeWidth={1}
                                        strokeDasharray="4 2"
                                    />
                                    <g
                                        onClick={e => {
                                            e.stopPropagation();
                                            alert(`Data collector: ${st.data_collector.name}`);
                                            // Or call a callback
                                        }}
                                        style={{cursor: "pointer"}}
                                    >
                                        {/* Tag background */}

                                        {/* Tag text */}
                                        <text
                                            x={shape.width / 2}
                                            y={-40}
                                            textAnchor="middle"
                                            fontSize={13}
                                            fontWeight="bold"
                                            letterSpacing={0.5}
                                            fill="#3730a3"
                                            style={{
                                                dominantBaseline: "middle",
                                                userSelect: "none",
                                                pointerEvents: "none" // so click is handled by <g>
                                            }}
                                        >
                                            {st.data_collector.name}
                                        </text>
                                    </g>
                                    {/* Data collector rect */}
                                    <rect
                                        x={(shape.width - 10) / 2}
                                        y={-5}
                                        width={10}
                                        height={8}
                                        rx={0}
                                        fill="#1d1d1d"
                                    />
                                    {/* Line from data collector rect to station */}
                                    <line
                                        x1={shape.width / 2}
                                        y1={0}
                                        x2={shape.width / 2}
                                        y2={0}
                                        stroke="#888"
                                        strokeWidth={1}
                                        strokeDasharray="4 2"
                                    />
                                </>
                            )}
                            {/* Show label only for medium and up */}
                            {size === "medium" && (
                                <text
                                    x={shape.width / 2}
                                    y={shape.height / 2 + shape.fontSize / 3}
                                    textAnchor="middle"
                                    fontSize={shape.fontSize}
                                    fontWeight="bold"
                                    fill="#222"
                                >
                                    {st.name}
                                </text>
                            )}
                            {size === "normal" || size === "big" ? (
                                <>
                                    <text
                                        x={shape.width / 2}
                                        y={shape.height / 2 - 6}
                                        textAnchor="middle"
                                        fontSize={shape.fontSize}
                                        fontWeight="bold"
                                        fill="#222"
                                    >
                                        {st.name}
                                    </text>
                                    <text
                                        x={shape.width / 2}
                                        y={shape.height / 2 + 16}
                                        textAnchor="middle"
                                        fontSize={shape.fontSize * 0.8}
                                        fill="#333"
                                    >
                                        {st.owner}
                                    </text>
                                </>
                            ) : null}
                        </g>
                    )
                }
            )}

                {Object.entries(operatorGroups).map(([bound, members], groupIdx) => {
                    // Separate by render direction
                    const byRender = {front: [] as OperatorAssignment[], rear: [] as OperatorAssignment[]};
                    members.forEach(m => {
                        if (m.operator.render === "front") byRender.front.push(m);
                        if (m.operator.render === "rear") byRender.rear.push(m);
                    });

                    // Utility: render lines and icon for a direction
                    const renderOperatorForDir = (group: OperatorAssignment[], dir: "front" | "rear") => {
                        if (group.length === 0) return null;

                        // Calculate icon centerX as avg of all station centers in the group
                        const groupX = group.map(({i}) => xCenters[i]);
                        const operatorX = groupX.reduce((a, b) => a + b, 0) / groupX.length;
                        // For Y, find max half-height to keep lines straight
                        const maxHalfHeight = Math.max(...group.map(({i}) => shapes[i].height / 2));
                        const operatorY =
                            dir === "front"
                                ? centerY - maxHalfHeight - 38 // 38px above (tweak to taste)
                                : centerY + maxHalfHeight + 38; // 38px below

                        return (
                            <g key={`${bound}_${dir}`}>
                                {/* Operator icon (rect) */}
                                <UserIcon x={operatorX} y={operatorY} size={30}/>
                                {/* Dashed lines from shape edge to operator icon */}
                                {group.map(({i}, idx) => (
                                    <line
                                        key={idx}
                                        x1={xCenters[i]}
                                        y1={
                                            dir === "front"
                                                ? centerY - shapes[i].height / 2 // top edge of rect
                                                : centerY + shapes[i].height / 2 // bottom edge
                                        }
                                        x2={operatorX}
                                        y2={dir === "front" ? operatorY + 15 : operatorY - 15}
                                        stroke="#818cf8"
                                        strokeWidth={1}
                                        strokeDasharray="6 3"
                                    />
                                ))}
                            </g>
                        );
                    };

                    return (
                        <React.Fragment key={bound}>
                            {renderOperatorForDir(byRender.front, "front")}
                            {renderOperatorForDir(byRender.rear, "rear")}
                        </React.Fragment>
                    );
                })}
        </g>
    );
};


const UserIcon: React.FC<{ x: number; y: number; size?: number }> = ({x, y, size = 30}) => (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="#6366f1"

            strokeLinecap="round"
            strokeLinejoin="round"
            style={{display: "block"}}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z"/>
            <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z"/>
        </svg>
    </g>
);
