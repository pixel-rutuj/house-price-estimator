CREATE DATABASE IF NOT EXISTS house_prices;
USE house_prices;
CREATE TABLE IF NOT EXISTS House (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gr_liv_area INT NOT NULL,
    overall_qual INT NOT NULL,
    garage_cars INT NOT NULL,
    year_built INT NOT NULL,
    price FLOAT NOT NULL
);
SELECT * FROM House;	