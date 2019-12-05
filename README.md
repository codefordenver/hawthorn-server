# hawthorn-server
The `hawthorn-server` repository contains the source code for the backend, data-access
layer of the Hawthorn project.

This backend process serves a [GraphQL](https://graphql.org/) API on port `:4000`.

## Software dependencies
The following software must be installed prior to running `hawthorn-server`:
* [git](https://git-scm.com/downloads) - This is for version control
* [Node.js](https://nodejs.org/en/) - Node is used for running `hawthorn-server` and installing dependent JavaScript packages using the `npm` command.
* [Docker](https://docs.docker.com/install/) - This is for running [FusionAuth](https://fusionauth.io/), [PostgreSQL](https://www.postgresql.org/), [ElasticSearch](https://www.elastic.co/products/elasticsearch), and [Prisma](https://www.prisma.io/) (you only need to install Docker manually, not these other things)
* [Prisma CLI](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/#installation) - The `prisma` CLI tool is used for deploying the database schema to the database, and for generating an interface for our `hawthorn-server` to interact with the database through.

## Set up a development environment
The following steps walk you through downloading `hawthorn-server`, installing some last minute packages, and running the server so that you can start coding.  Please [make a pull request](https://github.com/trex/hawthorn-server/pulls) if this process is incomplete or inaccurate, and [open an issue](https://github.com/trex/hawthorn-server/issues) if you cannot get things working.

### Clone `hawthorn-server`
Download the source code and change directories into your freshly cloned `hawthorn-server` directory:
```sh
#If your `git` is configured with SSH:
git clone git@github.com:trex/hawthorn-server.git && cd hawthorn-server
#If your `git` is configured with HTTPS:
git clone https://github.com/trex/hawthorn-server.git && cd hawthorn-server
```

### Download and run the Docker containers
The following command will download all of the required Docker images and get them running in the background.  If it is your first time running this command, it can take a while to download the Docker images.
```sh
docker-compose up -d
```

You can make sure all of the containers are up and healthy with the following command, the output is included to show the expected result:
```sh
docker-compose ps

       Name                      Command               State                       Ports
-------------------------------------------------------------------------------------------------------------
server_db_1           docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
server_fusionauth_1   /bin/sh -c /usr/local/fusi ...   Up      0.0.0.0:9011->9011/tcp
server_prisma_1       /bin/sh -c /app/start.sh         Up      0.0.0.0:4466->4466/tcp
server_search_1       /usr/local/bin/docker-entr ...   Up      0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp
```

### Deploy the database schema
The following command will deploy the database schema to the database:
```sh
prisma deploy
```

You can test that the schema was successfully deployed by navigating your browser to [http://localhost:4466/]().  You should see a Prisma admin interface, click the "SCHEMA" and "DOCS" tabs on the righthand side to see the possible queries and mutations we can make against our data access layer, and the various data we can expect to be returned.  This defines the interface `hawthorn-server` will use to query and mutate data in the database.

The following command will generate JavaScript code that we will call to interact with our database:
```sh
prisma generate
```

### Install Node and JavaScript packages
The following command installs the required packages that are specified in `package.json`:
```sh
npm install
```

### Run the API server
Finally, start the `hawthorn-server` process:
```
npm run dev
```

You can test that everything is working by navigating your browser to [http://localhost:4000/]().  You should see a GraphQL admin interface, that looks similar to the Prisma admin interface.

You will notice that the "DOCS" and "SCHEMA" tabs on the right show much less information than they did in the Prisma interface.   Here, the "SCHEMA" and "DOCS" tabs show the possible queries and mutations we can make against our GraphQL API layer. This defines the interface client applications ([hawthorn-client](https://github.com/trex/hawthorn-client)) use to talk to `hawthorn-server`.

## System layout

### GraphQL - API layer
The graphql schema is defined in [schema.graphql](./schema.graphql).  The schema specifies various datatypes, and the how data may be queries or mutated through the GraphQL API.

The resolver functions are defined in [index.js](./index.js).  Resolvers determine how to handle a requests to the GraphQL API.

### Prisma - data access layer
Prisma deploys a database schema to our PostgreSQL database based on the schema definition found in [datamodel.prisma](./datamodel.prisma).

Prisma offers an easy method of interacting with the database by generating JavaScript code that defines these interactions.


#### Updating the data model
Update [datamodel.prisma](./datamodel.prisma) to define changes to the data model.
Then, deploy an updated database schema:
```sh
prisma deploy
```

Finally, generate an updated JavaScript client:
```sh
prisma generate
```

### Docker
The following services run in docker containers:
- prisma client - ORM for primary application database
- postgresql - primary application data store.  This maintains databases for both `hawthorn-server` and FusionAuth
- FusionAuth - user authentication and access management.  This is necessary for privileged application access for content moderation.
- FusionAuth search - elastic search for querying users

Run these services in the background with the command:
```sh
# For development:
docker compose up -d
# For production:
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
```
