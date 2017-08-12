export default function(state = {}, action) {
    switch (action.type) {
        case 'PREVIEW_INIT':
            return Object.assign({},
                state,
                { showPdf: false }
            );
        case 'PREVIEW':
            console.log("preview reducer");
            return Object.assign({},
                state,
                { showPdf: true }
            );
        default:
            return state;
    }
}
