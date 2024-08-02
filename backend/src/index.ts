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

app.listen(3000, () => console.log('Server Started!'));