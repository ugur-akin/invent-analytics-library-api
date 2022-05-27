# REST API Server

## Language & Tools

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/) - web framework
- [Sequelize](https://sequelize.org/) and [SQLite](https://www.sqlite.org/) for the database
- [SuperTest](https://github.com/visionmedia/supertest#readme)
- [Jest](https://jestjs.io/)

Note: Every command discussed below should be run from the `/server` directory.

## Quickstart

This section contains all the information required for getting the server up and running.

### Installing Dependencies

Install the required dependencies by running `npm install`

### Run the server

`npm run dev` - launches the express server in debug mode (with hot-reloading) on port 3000.

### Testing Routes

Everything is designed so the API formats in the postman collection provided will work by default.

### Unit tests

`npm run test` - runs all the tests with [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest#readme).

### Formatting

`npm run lint` will lint and format your code using [eslint](https://eslint.org/) from inside the `/server` directory.

## Database

**Note: No database setup should be required to get started with running the project.**

This project uses SQLite, which stores your tables inside a file (`database.db`) for development, and uses an in-memory database for testing.

#### Resetting the Database

If you would like to reset your database, you can run `npm run seed`
