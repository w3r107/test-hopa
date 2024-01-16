import { useEffect, useState } from "react";
import AccessTimeIcon from '@material-ui/icons/AccessTime'; // Importing the stopwatch icon

const Stopwatch = ({ startTime }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);  // Update every second

        return () => clearInterval(intervalId);
    }, [startTime]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <span>
            <AccessTimeIcon style={{ fontSize: 'extra-large', verticalAlign: 'middle' }} /> {formatTime(elapsedTime)}
        </span>
    );
};

export default Stopwatch;
