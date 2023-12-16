import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

ChartJS.register(ArcElement, Tooltip, Legend);
const color_list = ['#E57373', '#64B5F6', '#81C784', '#FFF176', '#FFB74D', '#BA68C8', '#4DD0E1', '#F06292', '#AED581', '#F48FB1']



const PieChart = () => {
  const initialChartData = {
    labels: ['Others'],
    datasets: [{
      data: [100],
      backgroundColor: [color_list[0]],
      hoverBackgroundColor: [color_list[0]]
    }]
  };

  const [chartData, setChartData] = useState(initialChartData);
  const [entries, setEntries] = useState([{ name: '', percentage: '' }]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEntries([{ name: '', percentage: '' }]);
  };

  const handleEntryChange = (index, type, value) => {
    const newEntries = [...entries];
    newEntries[index][type] = value;
    setEntries(newEntries);
  };

  const addNewEntry = () => {
    setEntries([...entries, { name: '', percentage: '' }]);
  };

  const commitDataToChart = () => {
    let currentTotal = entries.reduce((acc, entry) => acc + Number(entry.percentage), 0);

    if (currentTotal > 100) {
      alert('Total percentage exceeds 100%. Please adjust the values.');
      return;
    }

    const newChartData = {
      labels: entries.map(entry => entry.name),
      datasets: [{
        data: entries.map(entry => entry.percentage),
        backgroundColor: entries.map((_,idx) => color_list[idx]),
        hoverBackgroundColor: entries.map((_,idx) => color_list[idx])
      }]
    };

    const othersPercentage = 100 - currentTotal;
    if (othersPercentage > 0) {
      newChartData.labels.push('Others');
      newChartData.datasets[0].data.push(othersPercentage);
      newChartData.datasets[0].backgroundColor.push(color_list[currentTotal-1]);
      newChartData.datasets[0].hoverBackgroundColor.push(color_list[currentTotal-1]);
    }

    setChartData(newChartData);
    handleDialogClose();
  };

  

  return (
    <div>
      <Pie data={chartData} />
      <Button variant="outlined" onClick={handleDialogOpen}>Add Data</Button>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Chart Data</DialogTitle>
        <DialogContent>
          {entries.map((entry, index) => (
            <div key={index}>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                value={entry.name}
                onChange={(e) => handleEntryChange(index, 'name', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Percentage"
                type="number"
                fullWidth
                value={entry.percentage}
                onChange={(e) => handleEntryChange(index, 'percentage', e.target.value)}
              />
              {index === entries.length - 1 && (
                <IconButton onClick={addNewEntry}>
                  <AddIcon />
                </IconButton>
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={commitDataToChart}>Commit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PieChart;
