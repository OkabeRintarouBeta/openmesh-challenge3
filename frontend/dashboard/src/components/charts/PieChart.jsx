import { useState,useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);
const color_list = ['#E57373', '#64B5F6', '#81C784', '#FFF176', '#FFB74D', '#BA68C8', '#4DD0E1', '#F06292', '#AED581', '#F48FB1'];

const PieChart = ({ totalAmount, setTotalAmount, entries, setEntries}) => {
  const [chartData, setChartData] = useState({
    labels: ['Others'],
    datasets: [{
      data: [100],
      backgroundColor: [color_list[0]],
      hoverBackgroundColor: [color_list[0]]
    }]
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [tempEntries, setTempEntries] = useState(entries); 
  const inputRef = useRef(null);
  const handleDialogOpen = () => {
    
    setTempEntries([...entries]); 
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTempEntryChange = (index, type, value) => {
    
    const newTempEntries = [...tempEntries];
    
    newTempEntries[index][type] = value;
    
    setTempEntries(newTempEntries);
  };
    

  const addNewTempEntry = () => {
    setTempEntries([...tempEntries, { name: '', percentage: '' }]);
  };

  const deleteTempEntry = (index) => {
    const newTempEntries = tempEntries.filter((_, idx) => idx !== index);
    setTempEntries(newTempEntries);
  };

  const commitDataToChart = () => {
    for (let i = 0; i < tempEntries.length; i++) {
      if (tempEntries[i].percentage=='' || totalAmount=='') {
          alert("Your input contain invalid number, please check")
          inputRef.current.focus(); // Focus on the input field after the alert
          return;
      }
  }
    let currentTotal = tempEntries.reduce((acc, entry) => acc + Number(entry.percentage), 0);

    if (currentTotal > 100) {
      alert('Total percentage exceeds 100%. Please adjust the values.');
      return;
    }

    const newChartData = {
      labels: tempEntries.map(entry => entry.name),
      datasets: [{
        data: tempEntries.map(entry => entry.percentage),
        backgroundColor: tempEntries.map((_, idx) => color_list[idx]),
        hoverBackgroundColor: tempEntries.map((_, idx) => color_list[idx])
      }]
    };

    const othersPercentage = 100 - currentTotal;
    if (othersPercentage > 0) {
      newChartData.labels.push('Others');
      newChartData.datasets[0].data.push(othersPercentage);
      newChartData.datasets[0].backgroundColor.push(color_list[currentTotal - 1]);
      newChartData.datasets[0].hoverBackgroundColor.push(color_list[currentTotal - 1]);
    }

    setChartData(newChartData);
    setEntries(tempEntries); // Update the main entries state
    handleDialogClose();
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#100000',
        formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            const percentage = value;
            return `${value * totalAmount / 100} (${percentage}%)`;
        }
      },
      tooltip: {
        callbacks: {
            label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const percentage = value;
                return `${value * totalAmount / 100} (${percentage}%)`;
            },
        }
      }
    }
  };

  return (
    <div>
      <Pie data={chartData} options={options}/>
      <Button variant="outlined" onClick={handleDialogOpen}>Add Data</Button>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Chart Data</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Total Amount"
            type="number"
            fullWidth
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
          {tempEntries.map((entry, index) => (
            <div key={index}>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                value={entry.name}
                onChange={(e) => handleTempEntryChange(index, 'name', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Percentage"
                type="number"
                fullWidth
                value={entry.percentage}
                onChange={(e) => handleTempEntryChange(index, 'percentage', e.target.value)}
                
              />
              <div>
                <IconButton onClick={addNewTempEntry}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => deleteTempEntry(index)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={commitDataToChart} ref={inputRef}>Commit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PieChart;
