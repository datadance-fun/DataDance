# Data Dance Backend

## Run

Development (automatically reload when file is changed):

```shell
yarn start
```

Production:

```shell
yarn build
yarn start
```

## Configure

### GitHub API Token

A GitHub API token (with gist permission) must be specified in order to use code sharing features:

```shell
echo PLAYGROUND_GITHUB_TOKEN=<my_github_pat> >> .env
```

> The access token can be generated at https://github.com/settings/tokens

### Listen Address

```shell
echo PLAYGROUND_HOST=127.0.0.1 >> .env
echo PLAYGROUND_PORT=1345 >> .env
```

### TiDB Configurations

```shell
echo MY_SQL_DB_HOST=<my_tidb_host> >> .env
echo MY_SQL_DB_USER=<my_tidb_user> >> .env
echo MY_SQL_DB_PASSWORD=<my_tidb_password> >> .env
echo MY_SQL_DB_PORT=<my_tidb_port> >> .env
echo MY_SQL_DB_DATABASE=<my_tidb_database> >> .env
echo MY_SQL_DB_CONNECTION_LIMIT=100 >> .env
echo LIMIT_RETURNED_ROWS=1000 >> .env
```

### Advanced Configurations

You can also override the followig default `.env` configurations:

```shell
PLAYGROUND_API_PREFIX=/api    # The base path of all API endpoints
PLAYGROUND_CORS_ORIGIN=http://play.local   # The origin of the frontend
```

## OpenAPI

The OpenAPI is available at http://127.0.0.1:1345/docs after the server is started.

The OpenAPI JSON can also be retrieved without starting a server via:

```shell
yarn --silent openapi
```
