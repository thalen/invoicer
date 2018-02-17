import format from 'date-fns/format';
import subMonth from 'date-fns/sub_months';

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
                {
                    showPdf: false,
                    linkRemoved: true,
                    pdfLink: null,
                    ocr: null
                }
            );
        case 'INVOICES_LOADED':
            const values = action.payload.response.map((elem) => {
                return {
                    id: elem.Key,
                    timestamp: new Date(elem.LastModified),
                    created: format(elem.LastModified, 'YYYY-MM-DD')
                };
            });

            const copy = [...values];
            copy.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            let startDate = copy[0].timestamp;
            const addLabel = (list, currentDate) => {
                const elem = list[0];
                const orig = values.find(a => a.id === elem.id);

                const update = {
                    ...orig,
                    label: `thalen_${format(currentDate, 'YYYYMMDD')}.pdf`
                };
                if (list.length > 1) {
                    const retval = addLabel(list.splice(1), subMonth(currentDate, 1));
                    retval.push(update);
                    return retval;
                } else {
                    return [update];
                }
            };
            const invoices = addLabel(copy, startDate);

            return Object.assign({},
                state,
                {
                    invoices
                }
            );
        default:
            return state;
    }
}
