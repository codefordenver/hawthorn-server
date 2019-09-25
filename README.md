# hawthorn server

## Prisma - Data Access Layer

### Docker
The prisma client and database run in docker containers.  Run these services in the background with the command:
`docker compose up -d`

### Updating the data model
Update `prisma.yml` to define changes to the data model.
Migrate the database schema, generate and deploy a current prisma client with the command:
`prisma deploy`

## GraphQL - API Layer
The graphql schema is defined in `schema.graphql`, the resolvers are defined in `index.js`.

### Run the API Server
`npm run start`
