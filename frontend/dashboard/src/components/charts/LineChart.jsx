import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const color_list = ['#E57373', '#64B5F6', '#81C784', '#FFF176', '#FFB74D', '#BA68C8', '#4DD0E1', '#F06292', '#AED581', '#F48FB1']

const LineChart = ({ data,totalAmount,entries }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [dateRange, setDateRange] = useState('week');
  const [dateRangeValue, setDateRangeValue] = useState([new Date(), new Date()]);


  const [pieChartData, setPieChartData] = useState([]);
  const [lineWidth,setLineWidth]=useState(3);
  


  useEffect(() => {
    const filterData = (data, range) => {
      const maxDateTimestamp = Math.max(...data.map(item => new Date(item.date).getTime()));
      const maxDate = new Date(maxDateTimestamp);
      console.log(dateRangeValue)
      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        console.log(range)
        if (range === 'week') {
          return (maxDate - itemDate) / (1000 * 60 * 60 * 24) <= 7;
        } else if (range === 'month') {
          return maxDate.getMonth() === itemDate.getMonth() && maxDate.getFullYear() === itemDate.getFullYear();
        } else if (range === 'year') {
          console.log("year-----")
          const oneYearBefore = new Date(maxDate.getFullYear() - 1, maxDate.getMonth(), maxDate.getDate());
          return itemDate >= oneYearBefore && itemDate <= maxDate;
        }else if (range === 'custom' && dateRangeValue[0] && dateRangeValue[1]){
          console.log(dateRange)
          return itemDate >= dateRangeValue[0] && itemDate <= dateRangeValue[1];
        }else{
          setLineWidth(1)
          return true;
        }
      });
      return filtered;
    };
    setFilteredData(filterData(data, dateRange));
  }, [dateRange, data,dateRangeValue]);

  useEffect(() => {
    let base = 0;
    const newPieChartData = entries.map((entry, idx) => {
        const entryValue = entry.percentage * totalAmount / 100;
        base += entryValue; // Accumulate the value
        return {
            label: entry.name,
            data: new Array(filteredData.length).fill(base), // Use the accumulated value
            borderColor: color_list[idx],
            tension: 0.1,
            yAxisID: 'y',
            borderWidth: 1.5,
            pointRadius:0
        };
    });
    newPieChartData.push({
      label: 'total user input',
      data: new Array(filteredData.length).fill(totalAmount), 
      borderColor: color_list[entries.length],
      tension: 0.1,
      yAxisID: 'y',
      borderWidth: 1.5,
      pointRadius:0
    })
    setPieChartData(newPieChartData);
  }, [entries, totalAmount, filteredData.length]);
  
  const handleDateRangeChange = (item) => {
    console.log(item)
    setDateRangeValue(item);
    console.log(dateRangeValue)
    setDateRange('custom');
  };

  const chartData = {
    labels: filteredData.map(d => d.date),
    datasets: [{
      label: 'ETH Supply',
      data: filteredData.map(d => d.y),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      yAxisID:'y',
      borderWidth: lineWidth
    },{
      label: 'Price',
      data: filteredData.map(d => d.price),
      borderColor: 'rgb(0, 192, 50)',
      tension: 0.1,
      yAxisID:'y1',
      borderWidth: lineWidth
    },
    ...pieChartData
  ]
  };


  const options = {
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Ethereum Supply', // Replace with your actual title
          color: '#666', // Optional: color of the title
          font: {
              size: 14, // Optional: font size of the title
              family: 'Helvetica', // Optional: font family of the title
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, 
        },
        title: {
          display: true,
          text: 'Price(USD)',
          color: '#666', 
          font: {
              size: 14, 
              family: 'Helvetica',
          }
        }
      },
    },
    plugins: {
      // tooltip: {
      //     mode: 'index',
      //     intersect: false,
      //     callbacks: {
      //         label: function(context) {
      //             let label = context.dataset.label || '';
      //             if (label) {
      //                 label += ': ';
      //             }
      //             label += context.parsed.y;
      //             return label;
      //         }
      //     }
      // }
  },
    hover: {
        mode: 'nearest',
        intersect: true
    }
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
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
      
      {dateRange === 'custom' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateRangePicker onChange={handleDateRangeChange} value={dateRangeValue} />
          </div>
        </LocalizationProvider>
      )}
      <Line data={chartData} options={options}/>
    </div>
  );
};

export default LineChart;