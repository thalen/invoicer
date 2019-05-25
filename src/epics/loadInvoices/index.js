import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const invoicesLoaded = payload => ({ type: 'INVOICES_LOADED', payload });
const loadInvoices = action$ =>
  action$
    .ofType('LOAD_INVOICES')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'GET',
          url: '/api/invoices'
        })
      ).map(invoicesLoaded);
    });

export default loadInvoices;
