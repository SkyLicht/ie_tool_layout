import React, {useState, useEffect} from 'react';

interface AnimatedCounterProps {
    count: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
                                                             count,
                                                             x,
                                                             y,
                                                             width = 30,
                                                             height = 16
                                                         }) => {
    const [displayCount, setDisplayCount] = useState(count);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (count !== displayCount) {
            setIsAnimating(true);

            // Update the display count after a short delay for animation effect
            const timer = setTimeout(() => {
                setDisplayCount(count);
                setIsAnimating(false);
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [count, displayCount]);

    return (
        <g>
            {/* Gray background box */}
            {/*<rect*/}
            {/*    x={x - width / 2}*/}
            {/*    y={y - height / 2}*/}
            {/*    width={width}*/}
            {/*    height={height}*/}
            {/*    rx={3}*/}
            {/*    fill="#6b7280"*/}
            {/*/>*/}

            {/* Animated text */}
            <text
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={26}
                fontWeight="bold"
                fill="#003153"
                fontFamily="var(--font-geist-mono)"
                style={{
                    dominantBaseline: "middle",
                    userSelect: "none",
                    transition: "all 0.3s ease",
                    transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${x}px ${y}px`,
                }}
                // Add these attributes for sharp text rendering
                shapeRendering="crispEdges"
                textRendering="optimizeLegibility"
                vectorEffect="non-scaling-stroke"

            >
                {displayCount}
            </text>

            {/* Animation effect - pulsing circle */}
            {isAnimating && (
                <circle
                    cx={x}
                    cy={y}
                    r={15}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={0}
                    style={{
                        animation: 'pulse 0.6s ease-out',
                        opacity: 0
                    }}
                >
                    <animate
                        attributeName="r"
                        values="8;20;8"
                        dur="0.6s"
                        repeatCount="1"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="0.6s"
                        repeatCount="1"
                    />
                </circle>
            )}
        </g>
    );
};

export default AnimatedCounter;
