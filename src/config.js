module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres@localhost/barhop',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/barhop-test',
    API_URL: process.env.API_URL || 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyB5zppx2H_TdbclNzQJMsEU-iOFP930_vE&type=bar'
}