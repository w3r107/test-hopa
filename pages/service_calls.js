import { Backdrop, Card, CircularProgress } from '@mui/material';
import { Header, MDBox, MDSnackbar } from 'components';
import ServiceCallsActions from 'components/elements/ServiceCallsActions';
import TableCallCard from 'components/elements/TableCallCard';
import DashboardLayout from 'layouts/DashboardLayout';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WSURL } from 'utils/axiosConfig';

const ServiceCalls = () => {
    const { t: translate } = useTranslation();
    const [tableCalls, setTableCalls] = useState([]);
    const [alertSound, setAlertSound] = useState(true);

    const socketRef = useRef(null);
    const reconnectTimeout = useRef(1000);
    const isMounted = useRef(true);
    const audioRef = useRef(null);
    const clearCallsInterval = useRef(null);


    useEffect(() => {
        clearCallsInterval.current = setInterval(() => {
            setTableCalls([]);
        }, 60000 * 3); // 1 minutes * 3

        return () => {
            clearInterval(clearCallsInterval.current);
        };
    }, []);


    const dismissCall = (tableNumber) => {
        setTableCalls(prevCalls => {
            const callToDismiss = prevCalls.find(call => call.tableNumber === tableNumber);
            if (callToDismiss && callToDismiss.timeoutId) {
                clearTimeout(callToDismiss.timeoutId); // Clear the timeout
            }
            return prevCalls.filter(call => call.tableNumber !== tableNumber);
        });
    };

    const playAlert = () => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio('/service_call_alert.mp3');
        }
        console.log(alertSound);

        if (alertSound == true)
            audioRef.current.play().catch(error => console.error('Error playing the audio:', error));
    };


    const connectWebSocket = () => {
        socketRef.current = new WebSocket(`${WSURL}/v1/ws/serviceCalls`);
        console.log("Instance Created");

        socketRef.current.addEventListener("open", () => {
            if (socketRef.current.readyState !== WebSocket.OPEN) return;
            console.log("Connection Opened");
            socketRef.current.send(JSON.stringify({
                type: "connect",
                clientId: localStorage.getItem("restaurantId")
            }));
        });

        socketRef.current.addEventListener("message", (message) => {
            if (socketRef.current.readyState !== WebSocket.OPEN) return;
            const { type, isCheck, tableNumber } = JSON.parse(message?.data);
            if (type === "newTableCall" && tableNumber) {
                const newCall = {
                    tableNumber,
                    isCheck,
                    startTime: Date.now(),
                    timeoutId: null,
                };

                newCall.timeoutId = setTimeout(() => {
                    setTableCalls(prevCalls => prevCalls.filter(call => call.tableNumber !== tableNumber));
                }, 180000); // 3 minutes

                setTableCalls(prevCalls => [...prevCalls, newCall]);
                playAlert();
            }
        });

        let reconnectTimeoutId;
        socketRef.current.addEventListener("close", () => {
            console.log('WebSocket connection closed');
            if (isMounted.current) {  // Only set a timeout if the component is still mounted
                reconnectTimeoutId = setTimeout(() => {
                    connectWebSocket();
                }, reconnectTimeout.current);
            }
        });
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            isMounted.current = false;
            if (socketRef.current) {
                socketRef.current.close();
            }
            clearTimeout(reconnectTimeout.current);
        };
    }, []);


    return (
        <>
            <DashboardLayout>
                <Header />
                <Card
                    id="basic-info"
                    sx={{ overflow: "auto", }}
                    style={{ minHeight: "calc(100vh - 120px)" }}
                >
                    <ServiceCallsActions
                        alertSound={alertSound}
                        setAlertSound={setAlertSound}
                    />
                    <MDBox
                        display="flex"
                        justifyContent="flex-start" // Align items to the right
                        alignItems="center"
                        height="80vh"
                        mx={10}
                        gap={10}
                        style={{ width: '100%', whiteSpace: 'nowrap' }} // Ensure it takes full width and prevents wrapping
                    >
                        {console.log(tableCalls)}
                        {tableCalls.length > 0 ? (
                            tableCalls.map((call, index) => (
                                <TableCallCard
                                    key={index}
                                    tableNumber={call.tableNumber}
                                    isCheck={call.isCheck}
                                    startTime={call.startTime}
                                    dismiss={() => dismissCall(call.tableNumber)}
                                />
                            ))
                        ) : (
                            <MDBox typography="h6" color="text.secondary">{translate("SERVICE_CALLS.NO_CALLS")}</MDBox>
                        )}
                    </MDBox>

                </Card>
            </DashboardLayout>

        </>
    );
};

export default ServiceCalls;
