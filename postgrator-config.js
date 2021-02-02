require('dotenv').config();
console.log(process.env.SSL);

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "ssl": !!process.env.SSL,
    "connectionString": (process.env.NODE_ENV === 'test')
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
}