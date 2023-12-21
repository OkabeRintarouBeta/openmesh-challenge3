#!/usr/bin/env python
# coding: utf-8

# In[6]:


get_ipython().system('pip install psycopg2-binary')


# In[3]:


import boto3
import psycopg2
from io import BytesIO

# AWS S3 configuration
aws_access_key_id = 'AKIARW2E4X2CJOS6KF5E'
aws_secret_access_key = '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'
s3_bucket_name = 'openmesh-fuzzy-bucket'
s3_object_key = 'to_processed/ethereum_data_20-12-2023.csv'

# AWS RDS configuration
rds_host = 'openmesh-fuzzy.c60vfrosrfhi.ap-southeast-2.rds.amazonaws.com'
rds_port = '5432'
rds_db_name = 'fuzzylogic'
rds_user = 'openmesh'
rds_password = 'openmesh123'

def download_data_from_s3(bucket_name, object_key):
    s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    response = s3.get_object(Bucket=bucket_name, Key=object_key)
    return response['Body'].read()

def insert_data_into_postgres(data, host, port, db_name, user, password):
    db_params = {
    'dbname': db_name,
    'user': user,
    'password': password,
    'host': host,
    'port': port,
}
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    data_io = BytesIO(data)
    # Assuming your data is in CSV format
    cursor.copy_from(data_io, 'ethereumdailysupply', sep=',')
    conn.commit()
    cursor.close()
    conn.close()

def delete_from_s3(bucket_name, object_key):
    s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    try:
        response = s3.delete_object(Bucket=bucket_name, Key=object_key)
        print(f"Object with key '{object_key}' deleted successfully")
    except Exception as e:
        print(f"Error '{e}'")

if __name__ == "__main__":
    data_from_s3 = download_data_from_s3(s3_bucket_name, s3_object_key)
    insert_data_into_postgres(data_from_s3, rds_host, rds_port, rds_db_name, rds_user, rds_password)


# In[4]:


delete_from_s3(s3_bucket_name, s3_object_key)


# In[ ]:




