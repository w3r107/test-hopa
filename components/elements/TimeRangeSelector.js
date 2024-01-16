import React, { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import 'react-time-picker/dist/TimePicker.css';
import MDBox from "./MDBox";
import MDTypography from "./MDTypography";
import { useTranslation } from "react-i18next";
import TimeInput from "./TimeInput";
import { Grid } from "@mui/material";


const TimeRangeSelector = ({ visibility, setVisibility }) => {
  const { t: translate } = useTranslation();
  const [timeRange, setTimeRange] = useState({
    start: '',
    end: ''
  });

  const [currentDay, setCurrentDay] = useState("");

  const [selectedDays, setSelectedDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });


  useEffect(() => {
    setSelectedDays(prevDays => {
      let updatedDays = { ...prevDays };
      visibility?.days.forEach(day => {
        updatedDays[day] = true;
      });
      return updatedDays;
    });

    setCurrentDay("Sunday")

    setTimeRange(() => ({
      start: visibility["Sunday"]?.start || '',
      end: visibility["Sunday"]?.end || ''
    }));

  }, []);

  // day change 
  const handleCheckChange = (day) => {
    setCurrentDay(day)

    if (selectedDays[day] === true) {
      setTimeRange({
        start: '0:0',
        end: '0:0',
      })
    } else {
      setTimeRange({
        start: visibility[day]?.start || '0:0',
        end: visibility[day]?.end || '0:0',
      })
    }


    setSelectedDays((prevDays) => {
      const updatedDays = {
        ...prevDays,
        [day]: !prevDays[day]
      };

      // Filter out only the days that are selected (true)
      const selected = Object.keys(updatedDays).filter(d => updatedDays[d]);

      // Update the visibility state in the parent component
      setVisibility(prevVisibility => ({
        ...prevVisibility,
        days: selected
      }));

      return updatedDays;
    });


  };


  // time change 
  const handleTimeChange = (type, value) => {
    let newValue = value;

    if (!currentDay || currentDay === "") return;

    if (type === 'startHour' || type === 'endHour') {
      // If the hour is being changed, use the current value of the minute input
      const minuteValue = type === 'startHour' ? timeRange.start.split(':')[1] : timeRange.end.split(':')[1];
      newValue = value + ':' + (minuteValue || "");
    } else if (type === 'startMinute' || type === 'endMinute') {
      // If the minute is being changed, use the current value of the hour input
      const hourValue = type === 'startMinute' ? timeRange.start.split(':')[0] : timeRange.end.split(':')[0];
      newValue = (hourValue || "") + ':' + value;
    }

    setTimeRange(prev => {
      const updatedTimeRange = {
        ...prev,
        [type.includes('start') ? 'start' : 'end']: newValue
      };

      setVisibility(prevVisibility => ({
        ...prevVisibility,
        [currentDay]: updatedTimeRange
      }));

      return updatedTimeRange;
    });
  };




  return (
    <div>
      <MDBox p={2}>
        <MDTypography variant="h5">
          {translate("EDITMODAL.TIME_RANGE_SELECT")}
        </MDTypography>
        <MDTypography variant="subtitle2" fontSize="small">
          {translate("EDITMODAL.TIME_RANGE_NOTE")}
        </MDTypography>
      </MDBox>
      <div >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {Object.keys(selectedDays).map((day) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Checkbox
                checked={selectedDays[day]}
                onChange={() => handleCheckChange(day)}
              />
              <MDBox p={2}>
                <MDTypography variant="h8">
                  {translate(`DAYS.${day}`)}
                </MDTypography>
              </MDBox>
            </div>
          ))}
        </div>

        <Grid container spacing={1} p={2}>
          <Grid item xs={6}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
              <MDBox p={2}>
                <MDTypography variant="h8">
                  {translate("EDITMODAL.CATEGORY_TIME_START")}
                </MDTypography>
              </MDBox>
              <TimeInput
                hourValue={timeRange.start.split(':')[0]}
                minuteValue={timeRange.start.split(':')[1]}
                onChangeHour={(e) => handleTimeChange('startHour', e.target.value)}
                onChangeMinute={(e) => handleTimeChange('startMinute', e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
              <MDBox p={2}>
                <MDTypography variant="h8">
                  {translate("EDITMODAL.CATEGORY_TIME_END")}
                </MDTypography>
              </MDBox>
              <TimeInput
                hourValue={timeRange.end.split(':')[0]}
                minuteValue={timeRange.end.split(':')[1]}
                onChangeHour={(e) => handleTimeChange('endHour', e.target.value)}
                onChangeMinute={(e) => handleTimeChange('endMinute', e.target.value)}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default TimeRangeSelector;