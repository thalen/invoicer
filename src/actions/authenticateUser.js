import { actionCreator } from '../store';

export const authenticateUser = dispatch => (user, password) => {
  dispatch({
    type: 'AUTHENTICATE',
    user,
    password
  });
};

export default actionCreator(authenticateUser);
