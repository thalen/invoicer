import { actionCreator } from '../configureStore';

const saveInvoice = (dispatch, getState) => (pdfLink, ocr) => {
  const arr = pdfLink.split('/');
  const { customer } = getState();
  dispatch({
    type: 'SAVE_INVOICE',
    pdf: arr[arr.length - 1],
    ocr,
    customerId: customer.selectedCustomer
  });
};

export default actionCreator(saveInvoice);
