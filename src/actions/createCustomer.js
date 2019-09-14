import { actionCreator } from '../store';

const createCustomer = dispatch => form => {
  dispatch({
    type: 'CREATE_CUSTOMER',
    form: {
      ...form
    }
  });
};

export default actionCreator(createCustomer);
