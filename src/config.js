module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://localhost/blogful'
};
