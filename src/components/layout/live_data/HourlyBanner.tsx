import React from 'react';

interface DataBannerProps {
    units: number;
    fail_test: number;
    oee: number;
    x: number;
    y: number;
    fontSize?: number;
    padding?: number;
    justify?: string;
}

const DataBanner: React.FC<DataBannerProps> = ({
                                                   units,
                                                   fail_test,
                                                   oee,
                                                   x,
                                                   y,
                                                   fontSize = 12,
                                                   padding = 8,
                                                   justify = "center"
                                               }) => {
    const rectWidth = 60;
    const rectHeight = 40;

    // Prussian blue color
    const prussianBlue = "#003153";

    // Calculate positions for rectangle based on justify
    const rectX = (() => {
        if(justify === "center"){
            return x - rectWidth / 2;
        }
        if(justify === "left"){
            return x - rectWidth;
        }
        if(justify === "right"){
            return x;
        }
        return x - rectWidth / 2; // fallback to center
    })();
    
    const rectY = y - rectHeight / 2;

    // Calculate text positions based on justify - text should be centered within the rectangle
    const textCenterX = (() => {
        if(justify === "center"){
            return x; // text stays at original x position
        }
        if(justify === "left"){
            return x - rectWidth / 2; // text centers within left-aligned rectangle
        }
        if(justify === "right"){
            return x + rectWidth / 2; // text centers within right-aligned rectangle
        }
        return x; // fallback to center
    })();
    
    const startY = y; // Start position for first row
    const lineHeight = 10; // Space between rows

    return (
        <g>
            {/* Single rectangle with stroke only */}
            <rect
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
                rx={4}
                fill="none"
                stroke={prussianBlue}
                strokeWidth={1.5}
            />

            {/* PZ value and label */}
            <text
                x={textCenterX}
                y={startY -6}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={prussianBlue}
                fontFamily="var(--font-geist-mono)"
                style={{
                    dominantBaseline: "middle",
                    userSelect: "none"
                }}
            >
                {units}
            </text>

             {/*FPY value and label */}
            <text
                x={textCenterX}
                y={startY + lineHeight }
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                fill={"#d82222"}
                fontFamily="var(--font-geist-mono)"
                style={{
                    dominantBaseline: "middle",
                    userSelect: "none"
                }}
            >
                {fail_test}
            </text>

            {/* FPY value and label */}
            {/*<text*/}
            {/*    x={textCenterX}*/}
            {/*    y={startY + lineHeight}*/}
            {/*    textAnchor="middle"*/}
            {/*    fontSize={fontSize}*/}
            {/*    fontWeight="bold"*/}
            {/*    fill={prussianBlue}*/}
            {/*    fontFamily="var(--font-geist-mono)"*/}
            {/*    style={{*/}
            {/*        dominantBaseline: "middle",*/}
            {/*        userSelect: "none"*/}
            {/*    }}*/}
            {/*>*/}
            {/*    FPY: {fpy}*/}
            {/*</text>*/}

            {/* OEE value and label */}
            {/*<text*/}
            {/*    x={textCenterX}*/}
            {/*    y={startY + (lineHeight * 2)}*/}
            {/*    textAnchor="middle"*/}
            {/*    fontSize={fontSize}*/}
            {/*    fontWeight="bold"*/}
            {/*    fill={prussianBlue}*/}
            {/*    fontFamily="var(--font-geist-mono)"*/}
            {/*    style={{*/}
            {/*        dominantBaseline: "middle",*/}
            {/*        userSelect: "none"*/}
            {/*    }}*/}
            {/*>*/}
            {/*    OEE: {oee}*/}
            {/*</text>*/}
        </g>
    );
};

export default DataBanner;