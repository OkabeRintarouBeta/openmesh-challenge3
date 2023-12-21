import React from 'react';
import { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

import styles from './Content.module.css';

const Content = () =>{
  const [data,setData]=useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [entries, setEntries] = useState([{ name: '', percentage: '' }]);

  useEffect(() => {
    fetch('https://openmeshfizzylogicbackend-env.eba-pkzpq5i2.ap-southeast-2.elasticbeanstalk.com/ ')
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
      <h2>Tutorial</h2>
      <div className={styles.tutorial}>
        <h3>Pie Chart</h3>
        <p>This interactive pie chart is designed to help you visualize the distribution of a cryptocurrency's initial token supply.</p>
        <p>To get started:</p>
        <ol>
          <li>Click on the <strong>"Build Chart" button</strong>. This will open a form.</li>
          <li>In the form, enter the <strong>initial supply</strong> of your chosen token (e.g., Ethereum).</li>
          <li>Add a <strong>Group</strong> to represent a category or stakeholder in the distribution.</li>
          <li>Specify the <strong>percentage</strong> of the initial supply allocated to this group.</li>
        </ol>
        <p>As you fill in the details, the pie chart will dynamically update to reflect the distribution based on your input.</p>
      </div>
      <div className={styles.tutorial}>
        <h3>Interactive Tokenomics Graph</h3>
        <p>Welcome to our dynamic graph, showcasing the latest data on Ethereum's circulating supply and price. 
          Here's how you can interact with and personalize the graph:
        </p>
        <ol>
          <li><strong>Live Data:</strong> Automatically displays current ETH supply & price.</li>
          <li><strong>Interactive Data Points:</strong> Hover on various data points within the graph for more detailed information specific to that date</li>
          <li><strong>Integrated Distribution:</strong> View your pie chart's token distribution in the graph.</li>
          <li><strong>Flexible Date Ranges:</strong> Choose from week, month, year or set a custom range.</li>
          <li><strong>Interactive Labels:</strong> Click labels to show or hide specific data lines.</li>
        </ol>
      </div>
      <h2>Main Content</h2>
      <div style={{display:'flex',justifyContent:'center',gap:'10%'}}>
        <PieChart totalAmount={totalAmount} setTotalAmount={setTotalAmount} entries={entries} setEntries={setEntries} />
        <LineChart data={data} totalAmount={totalAmount} entries={entries}/>;
      </div>
    </div>
  );
} 

export default Content;