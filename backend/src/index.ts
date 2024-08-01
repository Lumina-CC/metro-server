import * as express from 'express';
import offsetLimitParser from './modules/offsetLimitParser';
import getAddress from './routes/getAddress';
import getNameHistory from './routes/getNameHistory';
import listAddresses from './routes/listAddresses';
import listNames from './routes/listNames';
import listTransactions from './routes/listTransactions';

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

app.listen(3000, () => console.log('Server Started!'));