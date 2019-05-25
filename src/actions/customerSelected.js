import { actionCreator } from '../configureStore';

const customerSelected = dispatch => id => {
  dispatch({
    type: 'CUSTOMER_SELECTED',
    payload: {
      id
    }
  });
};

export default actionCreator(customerSelected);
