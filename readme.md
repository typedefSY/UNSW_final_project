# README

[![Worker Status](https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-3900w18bbrainwavebuilders/actions/workflows/worker-status.yml/badge.svg)](https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-3900w18bbrainwavebuilders/actions/workflows/worker-status.yml)

## Accessing the production copy of this code

This code has been deployed [here](https://brainwaves.yyjlincoln.app).

## Running the code locally without needing to make any changes

You can follow below instructions to run the code. Depending on individual computers, the build/startup process could take a long time. Please check the logs (which is automatically attached) for details.

In general, the project will be binding to [localhost:3900](http://localhost:3900). However, this port binding could be changed in the env file, so please check out [.dev/secrets/local.env](.dev/secrets/local.env) or [.dev/secrets/production.env](.dev/secrets/production.env) depending on your environment.

### Linux or UNIX-like systems (for example, MacOS)

-   Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/).
-   Make sure you have `GNU Make` available (you can test via `which make`).
-   Run `make run-local` (with local credentials, starting a fresh mysql database with no users), or `make run-production` (connecting to the production database).

### Other platforms

-   Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/).
-   Ensure all environmental variables listed in `.dev/secrets/local.env` (or `.dev/secrets/production.env` for production database configuration) are set.
-   Build the image via `docker compose -f docker-compose.local.yaml build`
-   Run the built images via `docker compose -f docker-compose.build.yaml up`

### Using pre-built images

Our CI is configured to automatically build, tag and push the latest stable version of the code. These images can be viewed from [here](https://github.com/orgs/unsw-cse-comp99-3900-24t1/packages?repo_name=capstone-project-3900w18bbrainwavebuilders).

To access this prebuilt version (which is guaranteed to be the current version on `main`), you can use [this docker compose file](/docker-compose.deploy.yaml).

To run pre-built images, ensure that the variables in [.dev/secrets/local.env](.dev/secrets/local.env) or [.dev/secrets/production.env](.dev/secrets/production.env) are available, then run:

```sh
docker compose -f docker-compose.deploy.yaml pull
docker compose -f docker-compose.deploy.yaml up
```

**Once running, the code should be available on [localhost:3900](http://localhost:3900) (unless configured otherwise - check the .env file for BIND_PORT).**

As this project is a website, it is meant for deployment on Unix-like machines. While it has been successfully ran on Windows, we are not testing the code actively on Windows. However, due to the nature of Docker and Docker Compose, any Windows machine that is capable of running Docker and Compose should be able to launch this code.

Note that this guide is for developers and testers only. Once deployed, users will only need to launch a website from their browser to access the platform.

## Setting up for development

This project uses [pre-commit](https://pre-commit.com/#install). Please install it prior to development. Then run:

```shell
pre-commit install
pre-commit install --hook-type commit-msg
```

to install git hooks. (or if you are using `make`, do `make pre-commit`).

Code is ran in Docker and Docker Compose. If you haven't already, please [install](https://docs.docker.com/compose/install/) it as well.

If you are on a Unix-like OS, you can optionally install Make. If you are on Windows, you can use [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

All project dependencies are setup automatically in the Docker for consistency.

## Running the code in development mode

If you have docker installed already, you can run the code by (in the project root directory):

```sh
make up
```

This will launch docker compose in daemon mode and run your app at:

| Service               | Port |
| --------------------- | ---- |
| main app (nginx)      | 3900 |
| client                | 3901 |
| backend               | 3902 |
| database (mysql)      | 3903 |
| database (phpmyadmin) | 3939 |

> Note: nginx is used as a reverse proxy to both client and backend. Use [localhost:3900](http://localhost:3900) in your browser to access the app.

> Note: phpmyadmin is used to access the database. Use [localhost:3939](http://localhost:3939) in your browser to access it.

To shutdown, do:

```sh
make down
```

This will stop the containers, but will retain the database data. To shutdown and remove all data, do:

```sh
make destroy
```

## Changing the database

If you need to change the database, you must:

-   Go to [schema.prisma](server/prisma/schema.prisma)
-   Update the schema file to your liking
-   Run `make db-diff`
-   Check the generated SQL at [migrations](server/prisma/migrations/). If it doesn't look right, remove the newly-generated migration and try again.
-   If it looks alright, do `make db-apply` to apply the changes.
