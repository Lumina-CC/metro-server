# metro-server
Metro is a universal currency designed for Minecraft servers, in a mostly Krist-compatible API format.

**⚠️ metro-server is not complete, and is in a development state. APIs may not function, and all content in the repo has not been tested. Further testing will be performed after record creation logic is completed.**

**⚠️ ALL commits past 8/2/2024 now follow the [ametro-30-dbq-1](LICENSE.md) license**

## Creating a development environment
Running metro-server isn't hard to do in a development environment. In fact, you can do so in 5 steps.
- Create a .env file:
    - `DBKEY`: The password/key for the `root` MySQL user
    - `BACKENDDBKEY`: The password/key for the `metroweb` MySQL user
- Spin up Metro in Docker
- Execute `init.sql` in `metro-server-db`
- Create the user `metroweb` in MySQL
```sql
CREATE USER metroweb IDENTIFIED BY 'yourbackenddbkey1234';
GRANT ALL PRIVILEGES ON *.* TO metroweb;
```
- Restart `metro-server-backend`

## Todo
- Finish API
- Address creation algorithm
- Reverse proxies (nginx)
- Documentation
- Automated testing


## Breaking update changes

- `3rd commit`: Added more fields to the `names` table in MySQL. Migrate using:
```sql
ALTER TABLE names ADD COLUMN original_owner CHAR(10) NOT NULL;
ALTER TABLE names ADD COLUMN transferred DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP();
```

- `8th commit`: Added table `namehistory`. Migrate using:
```sql
CREATE TABLE
    namehistory (
        id CHAR(36) NOT NULL,
        address VARCHAR(24) NOT NULL,
        wallet_to CHAR(10) NOT NULL,
        wallet_from char(10) DEFAULT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        type ENUM('transfer', 'purchase'),
        PRIMARY KEY (id)
    );
```

- `13th commit`: Changed columns under table `wallets`. Migrate using:
```sql
ALTER TABLE transactions MODIFY COLUMN type ENUM('transfer', 'name_purchase', 'name_transfer', 'tax') NOT NULL;
ALTER TABLE transactions ADD COLUMN state ENUM('completed', 'pending', 'reverted', 'held') NOT NULL DEFAULT 'pending';
```