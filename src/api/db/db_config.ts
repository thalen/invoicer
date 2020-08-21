export default {
  env: process.env.NODE_ENV || 'development',
  base_url: process.env.BASE_URL || 'http://localhost:3000',
  db: {
    uri: process.env.DB_URI || 'mongodb://127.0.0.1:27017/invoicer-api'
  }
};
