import './invoice.scss';
import {element} from 'deku'

export default {

    render({context, dispatch}) {
        let model = {};
        let notification = '';
        if (context.invoice.showPdf) {
            notification = (<div class="invoice__notification">Fakturan är laddad</div>);
        }
        return (
            <div class="invoice">
                <h3>Registrera faktura</h3>
                <fieldset class="invoice__form">
                    <p>Fyll i fakturauppgifterna nedan för att skapa din faktura</p>

                    <form onSubmit={e => {
                        e.preventDefault();
                        if (!model.hours.value.trim()) {
                            return;
                        }
                        if (!model.price.value.trim()) {
                            return;
                        }
                        console.log('hours: ' + model.hours.value);
                        console.log('price: ' + model.price.value);
                        dispatch({
                            type: 'PREVIEW_INIT',
                            model: {
                                hours: model.hours.value,
                                price: model.price.value
                            }
                        });
                        model.hours.value = '';
                        model.price.value = '';
                    }}>

                        <p>
                            <label for="hours">Antal timmar</label>
                            <input type="text" id="hours" ref={node => {
                                model.hours = node;
                            }}/>
                        </p>

                        <p>
                            <label for="price">Timpris</label>
                            <input type="text" id="price" ref={ node => {
                                model.price = node;
                            }
                            }/>
                        </p>

                        <p><input type="submit" value="Förhandsgranska"/></p>
                    </form>
                </fieldset>
                {notification}
            </div>
        )
    }
}