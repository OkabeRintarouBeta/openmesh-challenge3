import pandas as pd
import json

def csv2json(csv_dir, json_file):
    df = pd.read_csv(csv_dir)
    df = df[['Date(UTC)', 'total_eth_supply']]
    df=df.rename(columns={'Date(UTC)':'date','total_eth_supply':'y'})
    data_list = df.to_dict(orient='records')
    formatted_data = {idx + 1: data for idx, data in enumerate(data_list)}

    with open(json_file, 'w') as file:
        json.dump(formatted_data, file, indent=4)

if __name__ == '__main__':
    csv_dir = '../../Historial_supply_data.csv'  # Adjust the path as needed
    json_file = 'historical_data.json'
    csv2json(csv_dir, json_file)
