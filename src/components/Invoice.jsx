import './invoice.scss';
import {element} from 'deku'

export default {

    render({dispatch}) {
        let model = {};
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
                            type: 'PREVIEW',
                            model: model
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
            </div>
        )
    }
}