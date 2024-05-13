docker exec -it 9ae429379b32 mysql -u root -p

use react_express;

SHOW TABLES;




CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
