# Bugs
- [x] User not being logged out - same user staying in session
- DONE
- [x] tokenMiddleware being called twice per request from client
  - causing most mutation requests from playground to fail
  - error from logs: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  - deduplicate execution
- [x] Duplicated requests from client - same Post was inserted twice in the database
- [x] Resolving posts on user - "Could not find argument authorId for type Post"
# User
  - PHASE 1
  - [ ] Store session to prevent drops on server restart
  - PHASE 2
  - [ ] Register with username only
  - [ ] Hash userId on imageUrl
  - [ ] define roles
  - [ ] Pull imageUrl from FusionAuth for avatar
  - [ ] Pull FusionAuth integration out into a service
  - [ ] deleteUser
  - [ ] editUser
  - [ ] explore creating a custom UUID type for FA generated ID, currently using String
    - FusionAuth's UUID type is not compatible with GraphQL ID type and vise-versa
  - DONE
  - [x] Get new JWT w/ refresh token on JWT expiration
    - [x] Update JWT in cookie
    - [x] Redirect to login flow on expired refresh token
      - Key off of error_reason in refresh /oauth2/token response
  - [x] Trim User in schema to:
    - id
    - avatar - a random color initially.
  - [x] What to use for SESSION_SECRET?
  - [x] Expose non-sensitive FusionAuth config in endpoint
  - [x] logout
  - [x] /login puts access token and refresh token in cookie
  - [x] replace legacy user with the FusionAuth user
  - [x] get rid of user table and store a reference to the FA user id where needed
  - [x] createUser - create FA user - User no longer in prisma model
    - initial implementation using password grant
  - [x] OAuth2 Authorization Grant for login
# Group
- PHASE 2
  - [ ] Implement user grouping using FusionAuth groups
# Prompt
- PHASE 2
  - [ ] updatePrompt
# Post
- PHASE 1
- PHASE 2
  - [ ] Limit to 1 response per User per Prompt
  - [ ] updatePost
# Authorization
- PHASE 1
- PHASE 2
  - [ ] Permission requirements for all endpoints
- DONE
  - [x] common auth check functions
    - [x] validate tokens
    - [x] authentication protected requests - example on publishedPrompts
    - [x] role protected requests
# Configuration
- PHASE 1
- [ ] Prisma endpoint - in `prisma.yml`, how to use env var?
- DONE
- [x] FusionAuth endpoint
# Documentation
- PHASE 2
- [ ] How to update the datamodel
- [ ] How to deploy new datamodel / issue data migrations
- [ ] FusionAuth setup wizard, integration details - API key, Application ID
# General
- PHASE 1
- [ ] Move application database to postgresql
  - Use the same instance as FusionAuth db
- [ ] Cleanup dependencies
- [ ] Deploy somewhere
- PHASE 2
- [ ] Better error handling - apollo-errors?
- [ ] Tests
- [ ] Refactor index.js
- [ ] Automate build
