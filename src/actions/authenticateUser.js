import { actionCreator } from '../configureStore';

export const authenticateUser = dispatch => (user, password) => {
  dispatch({
    type: 'AUTHENTICATE',
    user,
    password
  });
};

export default actionCreator(authenticateUser);
