import { Observable } from 'rxjs';

const loginDone = payload => ({ type: 'AUTHENTICATED', payload });
const authenticate = action$ =>
  action$
    .ofType('AUTHENTICATE')
    .debounceTime(500)
    .mergeMap(action => {
      return Observable.ajax({
        method: 'POST',
        url: '/authenticate',
        body: {
          user_id: action.user,
          password: action.password
        }
      })
        .map(loginDone)
        .catch(error =>
          Observable.of({
            type: 'INVALID_CREDENTIALS',
            payload: error.xhr.response
          })
        );
    });

export default authenticate;
