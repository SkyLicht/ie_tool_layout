import React from "react";

export const RenderLineLabel = (
    {label, x, y}: { label: string, x: number, y: number }
) => {

    return (
        <>
            <rect
                x={x}
                y={y}
                width={100}
                height={30}
                fill="#003153"
                stroke={"#003153"}
                strokeWidth={2}
                rx={3}
            />

            <text
                x={x + 50}
                y={y + 16}
                textAnchor="middle"
                fontSize={18}
                fontWeight="bold"
                fill={"white"}
                fontFamily="var(--font-geist-mono)"
                style={{
                    dominantBaseline: "middle",
                    userSelect: "none"
                }}
            >
                Line {label}
            </text>
        </>
    )
}