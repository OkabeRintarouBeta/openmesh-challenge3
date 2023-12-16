import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    const filterData = (data, range) => {
  
      const maxDateTimestamp = Math.max(...data.map(item => new Date(item.date).getTime()));
      const maxDate = new Date(maxDateTimestamp);
      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        if (range === 'week') {
          return (maxDate - itemDate) / (1000 * 60 * 60 * 24) <= 7;
        } else if (range === 'month') {
          return maxDate.getMonth() === itemDate.getMonth() && maxDate.getFullYear() === itemDate.getFullYear();
        } else if (range === 'year') {
          const oneYearBefore = new Date(maxDate.getFullYear() - 1, maxDate.getMonth(), maxDate.getDate());
          return itemDate >= oneYearBefore && itemDate <= maxDate;
        }else{
          return true;
        }
      });
  
      // Log the filtered data
      console.log('Filtered data:', filtered);
  
      return filtered;
    };
  
    setFilteredData(filterData(data, dateRange));
  }, [dateRange, data]);
  
  const chartData = {
    labels: filteredData.map(d => d.date),
    datasets: [{
      label: 'Amount',
      data: filteredData.map(d => d.y),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div style={{width:"50%"}}>
      <FormControl fullWidth>
        <InputLabel id="date-range-label">Date Range</InputLabel>
        <Select
          labelId="date-range-label"
          id="date-range-select"
          value={dateRange}
          label="Date Range"
          onChange={(e) => setDateRange(e.target.value)}
        >
          <MenuItem value="week">Past Week</MenuItem>
          <MenuItem value="month">Past Month</MenuItem>
          <MenuItem value="year">Past Year</MenuItem>
          <MenuItem value="all">All</MenuItem>
          {/* Additional options */}
        </Select>
      </FormControl>
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
