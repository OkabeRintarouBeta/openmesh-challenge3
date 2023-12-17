import React from 'react';
import { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';


const Content = () =>{
  const [data,setData]=useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [entries, setEntries] = useState([{ name: '', percentage: '' }]);

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`ERROR: ${response.status}`);
        }
        const resp=response.json()
        return resp;
      })
      .then(historical_data => {
        let dataList = Object.keys(historical_data).map(key => {
          return {
              date: historical_data[key].date,
              y: historical_data[key].total_eth_supply,
              price:historical_data[key].price
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
        <PieChart totalAmount={totalAmount} setTotalAmount={setTotalAmount} entries={entries} setEntries={setEntries} />
        <LineChart data={data} totalAmount={totalAmount} entries={entries}/>;
      </div>
    </div>
  );
} 

export default Content;