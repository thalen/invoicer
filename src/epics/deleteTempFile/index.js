import { Observable } from 'rxjs';
import authenticationProvider from '../../services/authenticationProvider';

const linkRemoved = payload => ({ type: 'LINK_REMOVED', payload });
const deleteTempFile = action$ =>
  action$
    .ofType('REMOVE_LINK')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax(
        authenticationProvider({
          method: 'DELETE',
          url: `/api/pdf/${action.asset}`
        })
      ).map(linkRemoved);
    });

export default deleteTempFile;
