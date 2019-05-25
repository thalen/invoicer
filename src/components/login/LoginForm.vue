<template>
    <v-flex xs8 offset-xs2>
        <div class="login">
            <h3>Logga in</h3>
            <fieldset class="login__form">
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

                    <v-btn v-on:click="onSubmit" color="info" type="submit">Logga in</v-btn>

                </form>
                <span v-if="loginFailed" class="login__error">Inloggningen misslyckades</span>
            </fieldset>
        </div>
    </v-flex>
</template>
<script>
import './LoginForm.scss';
import authenticateUser from '../../actions/authenticateUser';

export default {
  name: 'invoice',
  data() {
    return {
      user: '',
      password: '',
      loginFailed: this.$select('router.loginFailed as loginFailed'),
      loggedIn: this.$select('router.loggedIn as loggedIn')
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      authenticateUser(this.user, this.password);
    }
  },
  watch: {
    loggedIn(newVal) {
      if (newVal) {
        this.$router.push('invoice');
      }
    }
  }
};
</script>
