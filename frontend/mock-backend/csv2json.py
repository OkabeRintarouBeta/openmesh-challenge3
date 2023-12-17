import pandas as pd
import json
from datetime import datetime

def csv2json(csv_dir1, csv_dir2,json_file):
    df = pd.read_csv(csv_dir1)
    df2 = pd.read_csv(csv_dir2)

    # Preparing df2
    df2 = df2[['snapped_at', 'price']]
    df2['snapped_at'] = pd.to_datetime(df2['snapped_at'], format='%Y-%m-%d %H:%M:%S %Z')
    df2['snapped_at'] = df2['snapped_at'].dt.strftime('%m/%d/%Y')
    df2 = df2.rename(columns={'snapped_at': 'date'})

    # Preparing df
    df['Date(UTC)'] = pd.to_datetime(df['Date(UTC)'], format='%m/%d/%Y', errors='coerce')
    df['Date(UTC)'] = df['Date(UTC)'].dt.strftime('%m/%d/%Y')
    df = df[['Date(UTC)', 'total_eth_supply']]
    df = df.rename(columns={'Date(UTC)': 'date'})
    
    # Merging df and df2
    merged_df = pd.merge(df, df2, on='date', how='outer')
    merged_df.fillna(0,inplace=True)

    data_list = merged_df.to_dict(orient='records')
    formatted_data = {idx: data for idx, data in enumerate(data_list)}

    with open(json_file, 'w') as file:
        json.dump(formatted_data, file, indent=4)

if __name__ == '__main__':
    csv_dir = '../../Historial_supply_data.csv'
    csv_dir2='../../eth-usd-max.csv'
    json_file = 'historical_data.json'
    csv2json(csv_dir, csv_dir2, json_file)
