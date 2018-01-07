import {getStore} from '../configureStore';

const authenticationProvider = (params) => {
    const store = getStore();
    if (store.state.router.loggedIn) {
        return {
            ...params,
            headers: {
                'Authorization': `Bearer ${store.state.router.token}`
            }
        }
    } else {
        return params;
    }
};

export default authenticationProvider;