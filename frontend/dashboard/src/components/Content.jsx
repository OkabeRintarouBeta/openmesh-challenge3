import React from 'react';
import { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

const Content = () =>{
  const [data,setData]=useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`ERROR: ${response.status}`);
        }
        const resp=response.json()
        return resp; // This returns a promise
      })
      .then(historical_data => {
        let dataList = Object.keys(historical_data).map(key => {
          return {
              date: historical_data[key].date,
              y: historical_data[key].y
          };
      });
        setData(dataList);
      })
      .catch(error => {
        console.error(`ERROR: ${error.message}`);
      });
  }, []);

  return (
    <div style={{ flexGrow: 1 }}>
      <h2>Main Content</h2>
      <div style={{display:'flex',justifyContent:'center',gap:'10%'}}>
        <PieChart/>
        <LineChart data={data} />;
      </div>
    </div>
  );
} 

export default Content;