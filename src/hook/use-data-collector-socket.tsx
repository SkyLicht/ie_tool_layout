import { useState, useEffect, useRef, useCallback } from 'react';
import {DecodeSummary, InitSummaryLines} from "@/data/decoder/decoder-summary-update";

export interface MonitorData {
    CONTAINER_NO: string;
    EMP_NO: string;
    GROUP_NAME: string;
    IN_LINE_TIME: string;
    IN_STATION_TIME: string;
    LINE_NAME: string;
    MODEL_NAME: string;
    MO_NUMBER: string;
    PALLET_NO: string;
    SECTION_NAME: string;
    SERIAL_NUMBER: string;
    STATION_NAME: string;
    VERSION_CODE: string;
    ERROR_FLAG: string;
}

export interface WebSocketMessage {
    message: string;
    timestamp: string;
    data: MonitorData[];
}

export interface UseWebSocketMonitorReturn {
    data: MonitorData[];
    currentHourSummary: SummaryLines;
    latestMessage: WebSocketMessage | null;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    error: string | null;
    reconnect: () => void;
}

export const useWebSocketMonitor = (
    url: string = 'ws://localhost:9091/ws/monitor',
    options?: {
        reconnectAttempts?: number;
        reconnectInterval?: number;
        onMessage?: (message: WebSocketMessage) => void;
        onError?: (error: Event) => void;
        onConnect?: () => void;
        onDisconnect?: () => void;
    }
): UseWebSocketMonitorReturn => {
    const [data, setData] = useState<MonitorData[]>([]);
    const [currentHourSummary, setCurrentHourSummary] = useState<SummaryLines>(InitSummaryLines());
    const [latestMessage, setLatestMessage] = useState<WebSocketMessage | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [error, setError] = useState<string | null>(null);
    
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const optionsRef = useRef(options);
    
    // Update options ref when options change
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connect = useCallback(() => {
        // Prevent multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN || 
            wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        // Clean up existing connection
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const opts = optionsRef.current || {};
        const {
            reconnectAttempts = 5,
            reconnectInterval = 3000,
            onMessage,
            onError,
            onConnect,
            onDisconnect
        } = opts;

        try {
            console.log('Attempting to connect to WebSocket:', url);
            setConnectionStatus('connecting');
            setError(null);
            
            wsRef.current = new WebSocket(url);

            wsRef.current.onopen = (event) => {
                console.log('WebSocket connected successfully');
                setConnectionStatus('connected');
                reconnectAttemptsRef.current = 0;
                onConnect?.();
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message= JSON.parse(event.data);
                    setLatestMessage(message);
                    onMessage?.(message);


                    if (message.type === 'summary_update') {
                        // Specific production data usage
                        console.log("inside summary_update")
                        const productionMessage = DecodeSummary(message);

                        // Accessing data
                        setCurrentHourSummary(productionMessage)

                    }
                    
                    // if (message.message === 'DATA_UPDATE' && Array.isArray(message.data)) {
                    //     setData(message.data);
                    //     setLatestMessage(message);
                    //     onMessage?.(message);
                    // }
                } catch (parseError) {
                    console.error('Failed to parse WebSocket message:', parseError);
                    setError('Failed to parse message data');
                }
            };

            wsRef.current.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason, 'wasClean:', event.wasClean);
                setConnectionStatus('disconnected');
                onDisconnect?.();
                
                // Only attempt to reconnect if it wasn't a clean close and we haven't exceeded attempts
                if (!event.wasClean && reconnectAttemptsRef.current < reconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${reconnectAttempts} in ${reconnectInterval}ms`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                } else if (reconnectAttemptsRef.current >= reconnectAttempts) {
                    console.log('Max reconnection attempts reached');
                    setError('Max reconnection attempts reached');
                }
            };

            wsRef.current.onerror = (event) => {
                console.error('WebSocket error:', event);
                setConnectionStatus('error');
                setError('WebSocket connection error');
                onError?.(event);
            };

        } catch (connectError) {
            console.error('Failed to create WebSocket connection:', connectError);
            setConnectionStatus('error');
            setError('Failed to create WebSocket connection');
        }
    }, [url]); // Only depend on URL

    const reconnect = useCallback(() => {
        console.log('Manual reconnect requested');
        
        // Clear any pending reconnection
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        
        // Close existing connection
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        // Reset reconnection attempts
        reconnectAttemptsRef.current = 0;
        
        // Attempt to connect
        connect();
    }, [connect]);

    useEffect(() => {
        console.log('WebSocket hook initializing...');
        connect();

        return () => {
            console.log('WebSocket hook cleaning up...');
            
            // Clear reconnection timeout
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            
            // Close WebSocket connection
            if (wsRef.current) {
                // Set a flag to prevent reconnection on cleanup
                const ws = wsRef.current;
                wsRef.current = null;
                ws.close(1000, 'Component unmounting'); // Clean close
            }
        };
    }, [connect]);

    return {
        data,
        currentHourSummary,
        latestMessage,
        connectionStatus,
        error,
        reconnect
    };
};