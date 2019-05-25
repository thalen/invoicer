import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const pdfCreated = payload => ({ type: 'PREVIEW', payload });
const previewEpic = action$ =>
  action$
    .ofType('PREVIEW_INIT')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'POST',
          url: `/api/customer/${action.model.customer}/invoice/preview`,
          body: {
            hours: action.model.hours,
            dueDate: action.model.dueDate,
            invoiceMonth: action.model.invoiceMonth
          }
        })
      ).map(pdfCreated);
    });

export default previewEpic;
