const result = require('dotenv').config({path: 'aws_config.env'});
if (result.error) {
    throw result.error;
}

console.log(result.parsed);
const App = require('./App');
App.default();
