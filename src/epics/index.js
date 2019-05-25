import { combineEpics, createEpicMiddleware } from 'redux-observable';

import preview from './preview';
import deleteTempFile from './deleteTempFile';
import saveInvoice from './saveInvoice';
import loadInvoices from './loadInvoices';
import authenticate from './authenticate';
import createCustomer from './createCustomer';
import getCustomers from './getCustomers';

const epicMiddleware = createEpicMiddleware(
  combineEpics(preview, deleteTempFile, saveInvoice, loadInvoices, authenticate, createCustomer, getCustomers)
);

export default epicMiddleware;
