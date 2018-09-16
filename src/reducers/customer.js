export default function(state = { status: 'INIT' }, action) {
    switch (action.type) {
        case "CREATE_CUSTOMER":
            return {
                ...state,
                status: 'IN_PROGRESS'
            };
        case "CREATE_CUSTOMER_DONE":
            return {
                ...state,
                status: 'CREATED'
            };
        case "CREATE_CUSTOMER_FAILED":
            return {
                ...state,
                status: 'FAILED'
            };
        default:
            return state;
    }
}
