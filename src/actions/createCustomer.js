import { actionCreator } from '../configureStore';

const createCustomer = dispatch => form => {
  dispatch({
    type: 'CREATE_CUSTOMER',
    form: {
      ...form
    }
  });
};

export default actionCreator(createCustomer);
