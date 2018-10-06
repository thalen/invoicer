const result = require('dotenv').config({path: 'application.env.local'});
if (result.error) {
    throw result.error;
}

console.log(result.parsed);
const App = require('./App');
App.default();
