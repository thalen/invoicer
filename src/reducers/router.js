export default function(state = {loggedIn: false}, action) {
    switch (action.type) {
        case 'AUTHENTICATED':
            return {
                ...state,
                loggedIn: true
            };
        case 'INVALID_CREDENTIALS':
            return {
                ...state,
                loginFailed: true
            };
        default:
            return state;
    }
}
