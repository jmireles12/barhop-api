require('dotenv').config();
console.log(process.env.SSL);

module.exports = {
    "migrationDirectory": "migrations",
    ssl: process.env.NODE_ENV === "production",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
}