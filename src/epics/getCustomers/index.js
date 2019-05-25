import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const getCustomersDone = payload => ({ type: 'LIST_CUSTOMERS_DONE', payload });
const getCustomers = action$ =>
  action$
    .ofType('LIST_CUSTOMERS')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'GET',
          url: `/api/customers?user_id=${action.user}`
        })
      )
        .map(getCustomersDone)
        .catch(error =>
          Observable.of({
            type: 'LIST_CUSTOMERS_FAILED',
            payload: error.xhr.response
          })
        );
    });

export default getCustomers;
