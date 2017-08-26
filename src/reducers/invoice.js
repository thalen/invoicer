export default function(state = {}, action) {
    switch (action.type) {
        case 'PREVIEW_INIT':
            return Object.assign({},
                state,
                { showPdf: false }
            );
        case 'PREVIEW':
            console.log("preview reducer, " + action.payload.filepath);
            return Object.assign({},
                state,
                { 
                    showPdf: true,
                    pdfLink: action.payload.response.filepath
                }
            );
        default:
            return state;
    }
}
