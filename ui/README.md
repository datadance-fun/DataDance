# Data Dance UI

## Run

Development (automatically reload when file is changed):

```shell
yarn gen:client
yarn start
```

Generate static files for production:

```shell
yarn build
```

## Configure

### Backend API Endpoint

By default, in development mode, the UI connects to a backend API hosted at `http://127.0.0.1:1345/api`. This is also the default listening address and base URL of the backend server.

In production mode, the UI connects to `/api`.

To change the behavior, set env variable `VITE_API_BASE_URL` when generating the static file or starting the dev server. For example:

```shell
VITE_API_BASE_URL=https://api.playground.datadance.dev/api yarn build
```
