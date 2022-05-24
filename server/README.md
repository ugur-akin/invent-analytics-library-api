# REST API Server

## Language & Tools

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/) - web framework
- [Sequelize](https://sequelize.org/) and [SQLite](https://www.sqlite.org/) for the database (you will not be required to write any database queries in order to complete this project) 
- [SuperTest](https://github.com/visionmedia/supertest#readme)
- [Jest](https://jestjs.io/)

Note: Every command discussed below should be run from the `/server` directory.

## Quickstart

This section contains all the information required for getting the server up and running.

### Installing Dependencies

Install the required dependencies by running `npm install`


### Run the server

`npm run dev` - launches the express server in debug mode (with hot-reloading) on port 5000.

### Testing Routes

#### Example cURL Commands
You can log in as the seeded account with the following command:
```bash
curl --request POST 'localhost:5000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "password": "sample"
}'
```
You can then use the token returned from the `/api/login` request to make an authenticated request to get the user:
```bash
curl 'localhost:5000/api/user' \
--header 'Authorization: Bearer YOUR-TOKEN-HERE'
```
### Unit tests

`npm run test` - runs all the tests with [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest#readme). We've provided you with a few example tests and some fixtures to get you started.

#### Adding your own tests

If a ticket requires it, you can add a new test file to the `server/tests` folder. Ensure any new test files follow the naming format of `a_unique_name.test.js`

### Formatting

`npm run lint` will lint and format your code using [eslint](https://eslint.org/) from inside the `/server` directory.

## Database

**Note: No database setup should be required to get started with running the project.** 

This project uses SQLite, which stores your tables inside a file (`database.db`) for development, and uses an in-memory database for testing.

#### Resetting the Database

If you would like to reset your database, you can run `npm run seed`
