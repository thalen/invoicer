export default function(state = { loggedIn: false }, action) {
  switch (action.type) {
    case 'AUTHENTICATE':
      return {
        ...state,
        user: action.user
      };
    case 'AUTHENTICATED':
      return {
        ...state,
        loggedIn: true,
        token: action.payload.response.token
      };
    case 'INVALID_CREDENTIALS':
      return {
        ...state,
        loginFailed: true
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false
      };
    default:
      return state;
  }
}
