import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stopwatch from './Stopwatch';
import { Button } from '@mui/material';
import MDButton from './MDButton';
import { useTranslation } from 'react-i18next';

const TableCallCard = ({ tableNumber, isCheck, startTime, dismiss }) => {
  const { t: translate } = useTranslation();

  const cardStyle = {
    minWidth: '350px',
    minHeight: '550px',
    borderColor: isCheck ? 'red' : 'green', // Change border color based on isCheck
    borderWidth: '3px', // Add border width if isCheck is true
    borderStyle: 'solid',
  };

  return (
    <Card className="bg-blue-500 mx-8 m-4 p-4 shadow-lg" style={cardStyle}>
      <CardContent>
        <Typography component="div" className="text-white text-center text-4xl">
          {translate("SERVICE_CALLS.TABLE")}
        </Typography>
        <Typography component="div" className="text-white text-center" style={{ fontSize: '12rem' }}>
          {tableNumber}
        </Typography>
        <Typography component="div" className="text-white text-center">
          <Stopwatch startTime={startTime} />
        </Typography>
        
        { <Typography component="div" className="text-red text-center" style={{ fontSize: '3rem', color: isCheck ? "red": "green" }}>
          {isCheck  ? "חשבון": "מלצר"}
        </Typography>}
        <MDButton
          style={{ width: "100%", alignSelf: "center", marginTop: 20 }}
          onClick={dismiss}
          variant="gradient"
          color="dark"
          size="large"
        >
          {translate("SERVICE_CALLS.DISMISS")}
        </MDButton>

      </CardContent>
    </Card>
  );
};

export default TableCallCard;
