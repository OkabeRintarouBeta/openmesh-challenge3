CREATE TABLE crypto.crypto_information(
	num SERIAL,
	id varchar(100) PRIMARY KEY,
	symbol varchar(50),
	name varchar(100),
	price real,
	rank integer,
	total_volume double precision)

INSERT INTO crypto.crypto_information(
	id, symbol, name, price, rank, total_volume
)
select id, symbol, name, price, rank, total_volume
from crypto_details

/*alter table crypto.crypto_information
add column last_updated timestamp*/

/*update crypto.crypto_information ci
	set last_updated = cv.last_updated
	from crypto.cryptovolume_details cv
	where ci.id = cv.id*/

create table crypto.cryptovolume_details(
	id varchar(100) PRIMARY KEY,
	fully_diluted_valuation double precision,
	high_24h real,
	low_24h real,
	price_change_24h double precision,
	price_change_percentage_24h real,
	market_cap_change_24h real,
	market_cap_change_percenatage_24h real,
	circulating_supply real,
	total_supply real,
	max_supply double precision,
	all_time_high real,
	alltimehigh_date timestamp,
	all_time_low real,
	alltimelow_date timestamp,
	last_updated timestamp
);

INSERT INTO crypto.cryptovolume_details(
	id, fully_diluted_valuation, high_24h, low_24h, price_change_24h,price_change_percentage_24h,
	market_cap_change_24h, market_cap_change_percenatage_24h, circulating_supply,total_supply,
	max_supply, all_time_high, alltimehigh_date, all_time_low, alltimelow_date,last_updated
)
select id, fully_diluted_valuation, high_24h, low_24h, price_change_24h,price_change_percentage_24h,
	market_cap_change_24h, market_cap_change_percentage_24h, circulating_supply,total_supply,
	max_supply, all_time_high,
	replace(replace(ath_date,'T',' '),'Z','')::timestamp,
	all_time_low,
	replace(replace(atl_date,'T',' '),'Z','')::timestamp,
	replace(replace(last_updated,'T',' '),'Z','')::timestamp
from crypto_details

CREATE table crypto.ethereumhistory(
	utc_date date,
	total_supply double precision,
	total_block_uncle_reward real,
	total_block_count integer,
	total_uncle_count integer,
	burntfees real
)

insert into crypto.ethereumhistory(
	utc_date, total_supply, total_block_uncle_reward, total_block_count,
	total_uncle_count, burntfees
)select date_utc::date, total_eth_supply, total_block_uncle_reward, total_block_count, total_uncle_count, BurntFees 
from ethereumhistory

--CONCAT(split_part(date_utc,'/',3),'-',split_part(date_utc,'/',1),
	   --'-',split_part(date_utc,'/',2))::date

CREATE TABLE crypto.ethereumusdmax(
	snapped_utc_time timestamp,
	price double precision,
	market_cap double precision,
	total_volume double precision
)

INSERT INTO crypto.ethereumusdmax(
	snapped_utc_time, price, market_cap, total_volume
)
SELECT snapped_at::timestamp, price, market_cap, total_volume
from ethereumusdmax


/*merge into crypto.crypto_information ci
using crypto_details cd
on ci.id = cd.id and 
when matched and ci.price <> cd.price or
				 ci.rank <> cd.rank or
				 ci.total_volume <> cd.total_volume*/
				 
				 
/*CREATE VIEW crypto.vw_ethereumfrontdata as (
select ethh.utc_date, eth.price, eth.total_volume, ethh.total_supply
from crypto.ethereumusdmax eth
inner join crypto.ethereumhistory ethh
on eth.snapped_utc_time::date = ethh.utc_date
order by ethh.utc_date asc)*/

--select * from crypto.vw_ethereumfrontdata order by utc_date desc

/*insert into crypto.ethereumusdmax(snapped_utc_time, price)
Select TO_CHAR(TO_DATE(price_date, 'DD-MM-YYYY'),'YYYY-MM-DD')::timestamp, price::double precision
from ethereumdailyprice where price_date <> '12-12-2023'*/

/*insert into crypto.ethereumhistory(utc_date, total_supply)
select supply_date::date, total_supply::double precision from ethereumdailysupply*/

-- Create stored procedure
/*CREATE OR REPLACE PROCEDURE crypto.insert_pricedata()
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete from ethereumdailyprice
    DELETE FROM ethereumdailyprice
    WHERE id = 'id';

    -- Insert into crypto.ethereumusdmax
    INSERT INTO crypto.ethereumusdmax(snapped_utc_time, price)
    SELECT
        TO_CHAR(TO_DATE(t1.price_date, 'DD-MM-YYYY'), 'YYYY-MM-DD')::timestamp,
        t1.price::double precision
    FROM
        ethereumdailyprice t1
    LEFT JOIN
        crypto.ethereumusdmax t2 ON TO_CHAR(TO_DATE(t1.price_date, 'DD-MM-YYYY'), 'YYYY-MM-DD')::date = t2.snapped_utc_time::date
    WHERE
        t2.price IS NULL;
END;
$$;

CREATE OR REPLACE PROCEDURE crypto.insert_supplydata()
LANGUAGE plpgsql
AS $$
BEGIN
	delete from ethereumdailysupply where total_supply = 'total_supply';

	insert into crypto.ethereumhistory(utc_date, total_supply)
		select 
			eds.supply_date::date,
			eds.total_supply::double precision
		from ethereumdailysupply eds
		left join crypto.ethereumhistory eth
		on eds.supply_date::date = eth.utc_date
		where eth.total_supply is NULL;
		
END;
$$;*/
