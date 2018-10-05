<template>
  <form class="form" method="POST" action="/register" @submit="checkForm" @keydown="form.errors.clear($event.target.name); form.errors.clear('credentials')">
    <input type="hidden" name="_token" :value="this.$root.token">
    <h1>Register</h1>
    <div class="field">
      <label class="label" for="username">Username</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('username') }" id="username" ref="username" name="username" type="text" placeholder="Username" v-model.trim="form.username" required>
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>  
        <p v-if="form.errors.has('username')" class="help is-danger" v-text="form.errors.get('username')"></p>
    </div>

    <div class="field">
      <label class="label" for="email">E-Mail</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('email') }"  id="email" name="email" type="email" placeholder="Email" v-model.trim="form.email" required>
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>  
        <p v-if="form.errors.has('email')" class="help is-danger" v-text="form.errors.get('email')"></p>
    </div>

    <div class="field">
      <label class="label" for="password">Password</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('password') }"  id="password" name="password" type="password" v-model.trim="form.password" placeholder="Password" required>
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
        <p v-if="form.errors.has('password')" class="help is-danger" v-text="form.errors.get('password')"></p>
    </div>

    <div class="field">
      <label class="label" for="password-confirm">Confirm Password</label>
      <div class="control has-icons-left">
        <input class="input"  id="password-confirm" name="password_confirmation" type="password" v-model.trim="form.password_confirm" placeholder="Confirm Password" @focus="form.errors.clear('password')" required>
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-primary" type="submit">Register →</button>
      </div>
    </div>
  </form>
</template>

<script>
import Form from "../../Form";
import { validateEmail } from "../../mixins";

export default {
  name: "Register",
  props: ["old", "errors"],
  mixins: [validateEmail],
  data() {
    let loginForm = new Form(
      {
        username: "",
        email: "",
        password: "",
        password_confirm: ""
      },
      this.old
    );
    loginForm.errors.record(this.errors);
    return {
      form: loginForm
    };
  },
  methods: {
    checkForm(e) {
      let { password, password_confirm, username, email } = this.form.data();

      if (password !== password_confirm) {
        this.form.errors.recordOne({
          name: "password",
          message: "The passwords do not match"
        });
      }

      if (password.length < 6) {
        this.form.errors.recordOne({
          name: "password",
          message: "The password must be at least 7 characters."
        });
      }

      if (username.length < 6) {
        this.form.errors.recordOne({
          name: "username",
          message: "The username must be at least 7 characters."
        });
      }

      if (email.length < 6 || !this.checkEmail(email)) {
        this.form.errors.recordOne({
          name: "email",
          message: "Please enter a valid email address"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  }
};
</script>

