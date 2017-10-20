export default function(state = {}, action) {
    switch (action.type) {
        case 'PREVIEW_INIT':
            return Object.assign({},
                state,
                { showPdf: false }
            );
        case 'PREVIEW':
            return Object.assign({},
                state,
                { 
                    showPdf: true,
                    pdfLink: action.payload.response.filepath,
                    ocr: action.payload.response.ocr
                }
            );
        case 'LINK_REMOVED':
            return Object.assign({},
                state,
                {
                    linkRemoved: true,
                    pdfLink: null,
                    ocr: null
                }
            );
        case 'INVOICE_SAVED':
            return Object.assign({},
                state,
                { showPdf: false }
            );
        default:
            return state;
    }
}
