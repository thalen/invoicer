import { actionCreator } from '../store';

const previewInvoice = dispatch => (pdfLink, selectedCustomer, { hours, dueDate, invoiceMonth }) => {
  if (pdfLink !== void 0 && pdfLink !== null) {
    let arr = pdfLink.split('/');
    dispatch({
      type: 'REMOVE_LINK',
      asset: arr[arr.length - 1]
    });
  }
  dispatch({
    type: 'PREVIEW_INIT',
    model: {
      customer: selectedCustomer,
      hours,
      dueDate,
      invoiceMonth
    }
  });
};

export default actionCreator(previewInvoice);
