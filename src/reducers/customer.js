export default function(state = { status: 'INIT' }, action) {
  switch (action.type) {
    case 'CREATE_CUSTOMER':
      return {
        ...state,
        status: 'IN_PROGRESS'
      };
    case 'CREATE_CUSTOMER_DONE':
      return {
        ...state,
        status: 'CREATED'
      };
    case 'CREATE_CUSTOMER_FAILED':
      return {
        ...state,
        status: 'FAILED'
      };
    case 'LIST_CUSTOMERS_DONE':
      return {
        ...state,
        customers: [
          { name: 'Välj kund...' },
          ...action.payload.response.map(customer => ({
            id: customer._id,
            name: customer.name
          }))
        ]
      };
    case 'CUSTOMER_SELECTED':
      return {
        ...state,
        selectedCustomer: action.payload.id
      };
    default:
      return state;
  }
}
