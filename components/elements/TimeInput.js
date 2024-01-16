import React from "react";
import MDInput from "./MDInput";
import { PiDotLight } from 'react-icons/pi';
import { Grid } from "@mui/material";



const TimeInput = ({
    hourName,
    minuteName,
    errorHour,
    errorMinute,
    label,
    hourPlaceholder,
    minutePlaceholder,
    hourValue,
    minuteValue,
    onChangeHour,
    onChangeMinute,
    className,
    style,
    containerClassName,
    disabled,
}) => {

    const handleNumericInput = (e) => {
        // Prevent non-numeric input
        if (!/^\d*$/.test(e.target.value)) {
            e.preventDefault();
        }
    };

    const handleHourChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 23) {
            onChangeHour(e);
        }
    };

    const handleMinuteChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 59) {
            onChangeMinute(e);
        }
    };
    return (
        <div >
            <Grid container alignItems="center" dir="ltr">
                <Grid item>
                    <MDInput
                        disabled={disabled}
                        style={{ width: '40px' }}
                        id={hourName}
                        type="text"
                        maxLength="2"
                        placeholder={hourPlaceholder}
                        value={hourValue}
                        onChange={handleHourChange}
                        onInput={handleNumericInput}
                        pattern="\d*"
                    />
                </Grid>

                <Grid item xs={1} >
                    <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <PiDotLight style={{ marginBottom: "-3px" }} />
                        <PiDotLight style={{ marginTop: "-3px" }} />
                    </div>
                </Grid>




                <Grid item>
                    <MDInput
                        disabled={disabled}
                        style={{ width: '40px' }} id={minuteName}
                        type="text"
                        maxLength="2"
                        placeholder={minutePlaceholder}
                        value={minuteValue}
                        onChange={handleMinuteChange}
                        onInput={handleNumericInput}
                        pattern="\d*"
                    />
                </Grid>
            </Grid>

            {errorHour && <p className="px-2 text-red-500 text-sm">{errorHour.message}</p>}
            {errorMinute && <p className="px-2 text-red-500 text-sm">{errorMinute.message}</p>}

        </div>
    );
};

export default TimeInput;
