# Bugs

# TODOs
- [ ] Deploy production build
- [ ] Audit public endpoints
- [ ] Add a flag for abusive content on Prompts and Posts
  - Use an enumerated type for different types of abuse?
- [ ] Tests
- [ ] Refactor index.js
- [ ] Automate build
- [ ] Store session to prevent drops on server restart
  - Is this done?
- [ ] Pull FusionAuth integration out into a service

- Documentation
  - [ ] FusionAuth setup wizard, integration details - API key, Application ID

# DONE
- [x] Cleanup dependencies
- [x] Better error handling
- [x] Deploy to custom domain
- [x] CORS Access-Control-Allow-Origin configuration
- [x] Make production docker-compose.yml with trimmed containers
- [x] Deploy somewhere!
- [x] User not being logged out - same user staying in session
- [x] tokenMiddleware being called twice per request from client
  - causing most mutation requests from playground to fail
  - error from logs: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  - deduplicate execution
- [x] Duplicated requests from client - same Post was inserted twice in the database
- [x] Resolving posts on user - "Could not find argument authorId for type Post"
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
- [x] common auth check functions
  - [x] validate tokens
  - [x] authentication protected requests - example on publishedPrompts
  - [x] role protected requests
- [x] Prisma endpoint - in `prisma.yml`, how to use env var?
- [x] FusionAuth endpoint
- [x] Move application database to postgresql
  - Use the same instance as FusionAuth db
