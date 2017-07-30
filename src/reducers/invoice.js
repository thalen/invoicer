export default function(state = {}, action) {
    switch (action.type) {
        case 'PREVIEW':
            console.log('preview reducer');
            return Object.assign({},
                state,
                { showPdf: true }
            );
        default:
            return state;
    }
}
