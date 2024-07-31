import * as express from 'express';
import offsetLimitParser from './modules/offsetLimitParser';
import getAddress from './routes/getAddress';
import listAddresses from './routes/listAddresses';
import listNames from './routes/listNames';
import listTransactions from './routes/listTransactions';

const app = express();

app.get('/addresses/rich', offsetLimitParser, listAddresses('balance DESC'));
app.get('/addresses/:address', getAddress);
app.get('/addresses', offsetLimitParser, listAddresses('firstSeen ASC'));
app.get('/addresses/:address/transactions', offsetLimitParser, listTransactions);
app.get('/addresses/:address/transactions', offsetLimitParser, listNames);

app.listen(3000, () => console.log('Server Started!'));