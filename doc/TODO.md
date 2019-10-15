# Bugs
- [ ] tokenMiddleware being called twice per request from client
  - causing most mutation requests from playground to fail
  - error from logs: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  - deduplicate execution
- [ ] Duplicated requests from client - same Post was inserted twice in the database
- DONE
- [x] Resolving posts on user - "Could not find argument authorId for type Post"
# User
  - PHASE 1
  - [ ] /login redirects to FusionAuth /oauth2/authorize
  - [ ] FusionAuth redirect_uri is a hawthorn-server endpoint
    - Currently implemented in /login
  - [ ] /login returns an access_token
  - [ ] Manage refresh tokens
  - [ ] Maintain auth state with Token in cookie, localStorage, or session?
    - [ ] explore creating a custom UUID type for FA generated ID, currently using String
      - FusionAuth's UUID type is not compatible with GraphQL ID type and vise-versa
  - PHASE 2
  - [ ] define roles
  - [ ] Pull imageUrl from FusionAuth for avatar
  - [ ] deleteUser
  - [ ] editUser
  - DONE
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
- PHASE 2
  - [ ] updatePost
# Authorization
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
- [ ] Automate build
