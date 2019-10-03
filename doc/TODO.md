# Bugs
- [ ] Resolving posts on user - "Could not find argument authorId for type Post"
# User
  - [ ] FusionAuth user migration
    - [x] replace legacy user with the FusionAuth user
    - [x] get rid of user table and store a reference to the FA user id where needed
    - [x] createUser - create FA user - User no longer in prisma model
      - initial implementation using password grant
    - [ ] OAuth2 Authorization Grant for login
    - [ ] explore creating a custom UUID type for FA generated ID, currently using String
    - [ ] Pull imageUrl from FusionAuth for avatar
  - [ ] deleteUser
  - [ ] editUser
  - [ ] define roles
# Group
  - [ ] Implement user grouping using FusionAuth groups
# Prompt
  - [ ] updatePrompt
# Post
  - [ ] updatePost
# Authorization
  - see getUser for simple auth check, then update
  - [ ] common auth check functions
    - [ ] validate tokens
    - [ ] authentication protected requests
    - [ ] role protected requests
# Configuration
- [ ] Prisma endpoint - in `prisma.yml`, how to use env var?
- [x] FusionAuth endpoint
# Documentation
- [ ] How to update the datamodel
- [ ] How to deploy new datamodel / issue data migrations
- [ ] FusionAuth setup wizard, integration details - API key, Application ID
# General
- [ ] Better error handling - apollo-errors?
- [ ] Move application database to postgresql
  - Use the same instance as FusionAuth db
- [ ] Tests
- [ ] Deploy somewhere
- [ ] Automate build
