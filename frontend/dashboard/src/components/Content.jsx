import React from 'react';
import { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import Tutorial from './Tutorial';

import styles from './Content.module.css';

const Content = () =>{
  const [data,setData]=useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [entries, setEntries] = useState([{ name: '', percentage: '' }]);

  useEffect(() => {
    fetch('https://openmeshfizzylogicbackend-env.eba-pkzpq5i2.ap-southeast-2.elasticbeanstalk.com/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`ERROR: ${response.status}`);
        }
        const resp=response.json()
        return resp;
      })
      .then(historical_data => {
        let dataList = historical_data.map(record => {
          return {
              date: record.date,
              token_supply: record.total_eth_supply,
              price:record.price
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
      <Tutorial />
      <h2>Main Content</h2>
      <div className={styles.charts}>
        <PieChart totalAmount={totalAmount} setTotalAmount={setTotalAmount} entries={entries} setEntries={setEntries} />
        <LineChart data={data} totalAmount={totalAmount} entries={entries}/>;
      </div>
    </div>
  );
} 

export default Content;