import * as express from 'express';
import offsetLimitParser from './modules/offsetLimitParser';
import getAddress from './routes/getAddress';
import getNameHistory from './routes/getNameHistory';
import getNameTransactions from './routes/getNameTransactions';
import listAddresses from './routes/listAddresses';
import listNames from './routes/listNames';
import listTransactions from './routes/listTransactions';
import search from './routes/search';
import * as bodyParser from 'body-parser';
import login from './routes/login';
import v2 from './routes/v2';
import getName from './routes/getName';
import nameCost from './routes/nameCost';
import checkName from './routes/checkName';

const app = express();

app.get('/addresses/rich', offsetLimitParser, listAddresses('balance DESC'));
app.get('/addresses/:address', getAddress);
app.get('/addresses', offsetLimitParser, listAddresses('firstSeen ASC'));
app.get('/addresses/:address/transactions', offsetLimitParser, listTransactions);
app.get('/addresses/:address/names', offsetLimitParser, listNames);

app.get('/lookup/addresses/:address', offsetLimitParser, getAddress);
app.get('/lookup/transactions/:address', offsetLimitParser, listTransactions);
app.get('/lookup/names/:address', offsetLimitParser, listNames);
app.get('/lookup/names/:name/history', offsetLimitParser, getNameHistory);
app.get('/lookup/names/:name/transactions', offsetLimitParser, getNameTransactions);
app.get('/search', search);
app.post('/search', bodyParser.text(), search);
app.post('/login', bodyParser.json(), login);
app.post('/v2', bodyParser.json(), v2);
app.post('/keylookup', bodyParser.json(), v2);
app.get('/names', offsetLimitParser, listNames);
app.get('/names/new', offsetLimitParser, listNames);
app.get('/names/cost', nameCost);
app.get('/names/check/:name', checkName)
app.get('/names/:name', getName);

app.listen(3000, () => console.log('Server Started!'));