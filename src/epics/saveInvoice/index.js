import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const invoiceSaved = payload => ({ type: 'INVOICE_SAVED', payload });
const saveInvoice = action$ =>
  action$
    .ofType('SAVE_INVOICE')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'POST',
          url: `/api/pdf/create/${action.pdf}?customerId=${action.customerId}`,
          body: {
            ocr: action.ocr
          }
        })
      ).map(invoiceSaved);
    });

export default saveInvoice;
