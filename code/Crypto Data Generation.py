#!/usr/bin/env python
# coding: utf-8

# In[1]:


get_ipython().system('pip install requests')


# In[2]:


get_ipython().system('pip install boto3')


# In[4]:


import boto3
import requests
import json
import pandas as pd
from datetime import datetime, timedelta
import os


# In[5]:


aws_access_key = 'AKIARW2E4X2CJOS6KF5E'
aws_secret_key = '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'
region_name = 'ap-southeast-2'
bucket_name = 'openmesh-fuzzy-bucket'


# In[6]:


s3 = boto3.client('s3', aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key, region_name=region_name)


# In[7]:


# Ethereum supply information API
api_url = 'https://api.etherscan.io/api?module=stats&action=ethsupply2'
api_key = '1RFQ6ENBX15RWDYXIH6N28XCKEMEBXI3FI'

# Cryptocurrency market data API
crypto_url = "https://api.coingecko.com/api/v3/coins/markets"
price_url = 'https://api.coingecko.com/api/v3/coins/ethereum/history?date='

# Current date
today_date = datetime.now() - timedelta(days=0)
formatted_date = today_date.strftime("%d-%m-%Y")

# Function to get real-time Ethereum supply info
def get_real_time_supply_info(api_url, api_key):
    request_url = f'{api_url}&apikey={api_key}'
    response = requests.get(api_url)

    if response.status_code == 200:
        print("Successful, Retrieving info.....")
        json_data = response.json()
        data = json_data['result']
        filename = f'raw_files/ethereum_raw_data_{formatted_date}.txt'
        with open(filename, 'w') as file:
            json.dump(json_data, file, indent=2)
        df = pd.DataFrame(data, index=[pd.Timestamp.today().date()])
        print("Done!")
        return df
    else:
        print(f'Error: Unable to access data. Status code: {response.status_code}')

# Cryptocurrency market data parameters
parameters = {
    'vs_currency': 'usd',
    'order': 'market_cap_desc',
    'per_page': 300,
    'page': 1,
    'sparkline': False,
}

all_coins = []

# Fetching data from multiple pages
while True:
    response = requests.get(crypto_url, params=parameters)
    print(response.status_code)
    if response.status_code == 200:
        price_data = response.json()
        if len(price_data) == 0:
            break
        all_coins.extend(price_data)
        parameters['page'] += 1
    else:
        print("Failed to fetch data")
        break
        
filename = f'raw_files/crypto_raw_data_{formatted_date}.txt'
with open(filename, 'w') as file:
    for item in all_coins:
        file.write(str(item) + '\n')

# Extracting cryptocurrency details
crypto_details = []
for coin_data in all_coins:
    crypto = {
        'id': coin_data['id'],
        'symbol': coin_data['symbol'],
        'name': coin_data['name'],
        'price': coin_data['current_price'],
        'rank': coin_data['market_cap_rank'],
        'total_volume': coin_data['total_volume'],
        'fully_diluted_valuation': coin_data['fully_diluted_valuation'],
        'high_24h': coin_data['high_24h'],
        'low_24h': coin_data['low_24h'],
        'price_change_24h': coin_data['price_change_24h'],
        'price_change_percentage_24h': coin_data['price_change_percentage_24h'],
        'market_cap_change_24h': coin_data['market_cap_change_24h'],
        'market_cap_change_percentage_24h': coin_data['market_cap_change_percentage_24h'],
        'circulating_supply': coin_data['circulating_supply'],
        'total_supply': coin_data['total_supply'],
        'max_supply': coin_data['max_supply'],
        'all_time_high': coin_data['ath'],
        'ath_date': coin_data['ath_date'],
        'all_time_low': coin_data['atl'],
        'atl_date': coin_data['atl_date'],
        'last_updated': coin_data['last_updated']
    }
    crypto_details.append(crypto)

# Creating a DataFrame from the cryptocurrency details
crypto_df = pd.DataFrame.from_dict(crypto_details)
crypto_df.to_csv(f"crypto_files_{formatted_date}.csv", index=False)

# Getting real-time Ethereum supply information and saving to CSV
data = get_real_time_supply_info(api_url, api_key)
data.to_csv(f"ethereum_data_{formatted_date}.csv")

# Fetching Ethereum daily price
eth_dailyprice = []
pricing_url = price_url + str(formatted_date)
response = requests.get(pricing_url)
price_data = response.json()
filename = f'raw_files/ethereum_raw_price_data_{formatted_date}.txt'
with open(filename, 'w') as file:
    json.dump(price_data, file, indent=2)
price = price_data['market_data']['current_price']['usd']
eth_details = {'id': 'ethereum', 'date': formatted_date, 'eth_price': price}
eth_dailyprice.append(eth_details)

# Creating a DataFrame for Ethereum daily price and saving to CSV
ethprice_df = pd.DataFrame.from_dict(eth_dailyprice)
ethprice_df.to_csv(f"ethereum_price_{formatted_date}.csv", index=False)

# Output statements
print("Cryptocurrency data saved to crypto_files.csv")
print("Ethereum supply data saved to ethereum_data.csv")
print("Ethereum daily price saved to ethereum_price.csv")


# In[10]:


folder = 'to_processed'
s3 = boto3.client('s3', aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key, region_name=region_name)
csv_files = [f for f in os.listdir() if f.endswith(f"{formatted_date}.csv")]

# Upload each CSV file to the S3 bucket with the specified folder
for csv_file in csv_files:
    s3_key = f'{folder}/{csv_file}'

    # Upload the CSV file to S3
    local_file_path = os.path.join(csv_file)
    s3.upload_file(local_file_path, bucket_name, s3_key)


# In[8]:





# In[ ]:




