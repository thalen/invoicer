import {element} from 'deku'
import {link} from '../bootstrap'

export default {

    render({context, dispatch}) {

        return (
            <ul>
                <li>
                    <a onClick={() => dispatch(link('/receiver'))}>Ange mottagare</a>
                </li>
                <li>
                    <a onClick={() => dispatch(link('/amount'))}>Ange belopp</a>
                </li>
                <li>
                    <a onClick={() => dispatch(link('/invoice'))}>Skicka faktura</a>
                </li>
            </ul>
        )
    }
}