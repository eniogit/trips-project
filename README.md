# BizAway tech-challenge

The project contains a backend written with `Express JS` and a frontend written in `NextJS`, both in `Typescript`.

## Setup

Docker files and docker compose are used to setup everything locally.

The infrastructure includes a `PostgresSQL` database and `Redis` for caching.

Configuration is made possible via .env files and Docker environment variables.

Environment variables take precedence.

It's important to set an `API_KEY` env for the backend, the rest is ok by default.

Run the following command to start the app:

```bash
docker compose up
```

visit http://localhost:8080/api-docs for Open API
and http://localhost:3000 for the app.
