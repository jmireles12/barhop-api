module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://epcifomwotivdd:2fdc67e3d42c5db5e57f921c8d3a16592cd699e4ad4191496c6f92b6c6e33bb4@ec2-54-225-18-166.compute-1.amazonaws.com:5432/d5l6386ig8kvr9',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/barhop-test',
    API_URL: process.env.API_URL || 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyB5zppx2H_TdbclNzQJMsEU-iOFP930_vE&type=bar'
}