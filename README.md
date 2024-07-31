# metro-server
Metro is a universal currency designed for Minecraft servers, in a Krist-compatible API format.

**⚠️ metro-server is not complete, and is in a development state. APIs may not function.**

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