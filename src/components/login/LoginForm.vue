<template>
    <div class="invoice layout-main">
        <h3>Logga in</h3>
        <fieldset class="invoice__form">
            <p>Ange inloggningsuppgifter</p>

            <form>
                <p>
                    <label for="user_id">Användarnamn</label>
                    <input v-model="user" type="text" id="user_id">
                </p>

                <p>
                    <label for="pwd">Lösenord</label>
                    <input v-model="password" type="password" id="pwd">
                </p>

                <button v-on:click="onSubmit">Logga in</button>
            </form>
            <span v-if="loginFailed" class="error">Inloggningen misslyckades</span>
        </fieldset>
    </div>
</template>
<script>
    import './LoginForm.scss';
    import {getStore} from '../../configureStore';
    const store = getStore();
    export default {
        name: 'invoice',
        data () {
            return {
                user: '',
                password: '',
                loginFailed: this.$select('router.loginFailed as loginFailed'),
                loggedIn: this.$select('router.loggedIn as loggedIn')
            }
        },
        methods: {
            onSubmit(event) {
                event.preventDefault();
                store.dispatch({
                    type: 'AUTHENTICATE',
                    user: this.user,
                    password: this.password
                });
            }
        },
        watch: {
            loggedIn(newVal) {
                if (newVal) {
                    this.$router.push('invoice');
                }

            }
        }
    }
</script>