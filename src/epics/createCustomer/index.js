import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const customerCreated = payload => ({ type: 'CREATE_CUSTOMER_DONE', payload });
const createCustomer = action$ =>
  action$
    .ofType('CREATE_CUSTOMER')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'POST',
          url: '/api/customer',
          body: {
            ...action.form
          }
        })
      )
        .map(customerCreated)
        .catch(error =>
          Observable.of({
            type: 'CREATE_CUSTOMER_FAILED',
            payload: error.xhr.response
          })
        );
    });

export default createCustomer;
