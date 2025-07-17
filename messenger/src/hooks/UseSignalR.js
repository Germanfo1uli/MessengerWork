import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useCallback, useEffect, useState, useRef } from 'react';

function useSignalR() {
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const isStartingRef = useRef(false); // Flag to prevent stop during start

    const startConnection = useCallback(async () => {
        if (isStartingRef.current || connection?.state === 'Connected') {
            return; // Avoid starting if already in progress or connected
        }

        isStartingRef.current = true;
        try {
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${process.env.API_BASE_URL || 'https://localhost:7001'}/chatHub`, {
                    skipNegotiation: true,
                    transport: 1, // WebSockets
                    accessTokenFactory: () => localStorage.getItem('authToken') || '',
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) => {
                        if (retryContext.previousRetryCount < 3) {
                            return 1000 * Math.pow(2, retryContext.previousRetryCount); // Exponential backoff
                        }
                        return null; // Stop after 3 retries
                    },
                })
                .build();

            setConnection(newConnection);

            newConnection.onclose(async () => {
                setIsConnected(false);
                console.log('SignalR Disconnected');
                // Attempt to restart only if not manually stopped
                if (!isStartingRef.current) {
                    await startConnection();
                }
            });

            await newConnection.start();
            setIsConnected(true);
            console.log('SignalR Connected');
        } catch (error) {
            console.error('SignalR Connection Error:', error);
        } finally {
            isStartingRef.current = false; // Reset flag after start attempt
        }
    }, []);

    const stopConnection = useCallback(async () => {
        if (connection && connection.state !== 'Disconnected') {
            isStartingRef.current = false; // Ensure stop is allowed
            await connection.stop();
            setIsConnected(false);
            console.log('SignalR Disconnected');
        }
    }, [connection]);

    useEffect(() => {
        startConnection();
        return () => {
            stopConnection(); // Cleanup on unmount
        };
    }, [startConnection, stopConnection]);

    return { connection, isConnected, startConnection, stopConnection };
}

export default useSignalR;