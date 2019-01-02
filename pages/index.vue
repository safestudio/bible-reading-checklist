<template>
  <div class="container h-100">
    <div class="row align-items-center h-100">
      <div class="col-sm-12 col-md-4 mx-auto">
        <div class="text-center">
          <h1 class="display-4">{{ $t('appName')}}<br/>&nbsp;<br/>&nbsp;</h1>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 mx-auto">
        <div class="jumbotron text-center">
          <div class="nav-center my-3">
            <ul class="nav nav-pills nav-center">
              <li class="nav-item">
                <a :class="['nav-link', activeForm === 'login' ? 'active' : '']" href="#" @click="changeForm('login')">{{ $t('login.title') }}</a>
              </li>
              <li class="nav-item">
                <a :class="['nav-link', activeForm === 'register' ? 'active' : '']" href="#" @click="changeForm('register')">{{ $t('register.title') }}</a>
              </li>
            </ul>
          </div>
          <p class="lead">{{ $t(activeForm + '.formTitle') }}</p>
          <form :class="'form-' + activeForm" v-on:submit.prevent="submit">
            <label for="inputEmail" class="sr-only">Email address</label>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus v-model="user.email">
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required autocomplete v-model="user.password">
            <div class="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me"> Remember me
              </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t(activeForm + '.title') }}</button>
            <p class="mt-5 mb-3 text-muted">&copy; 2019 by <a href="https://www.facebook.com/official.safe.studio.fanpage/" target="_blank">SAFE Studio</a></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import constant from "~/lib/constant";
import { auth } from "~/services/firebase";

export default {
  data() {
    return {
      activeForm: "login",
      user: {
        email: "",
        password: "",
      },
    };
  },
  created() {
    let currentUser = auth.currentUser;
    if (currentUser) {
      this.$router.push(constant.routes.userReadingChecklist);
    }
  },
  methods: {
    changeForm(type) {
      if (type === "login") {
        this.activeForm = "login";
      }
      if (type === "register") {
        this.activeForm = "register";
      }
    },
    validate() {
      this.formErrors = [];
      if (!this.user.email) this.pushFormError(this.$t("signin.form.email.errorText"));
      if (!this.user.password || this.user.password.length === 0) this.pushFormError(this.$t("signin.form.password.errorText"));
    },
    pushFormError(message) {
      this.formErrors.push(message);
    },
    submit() {
      let app = this;
      this.validate();
      if (this.formErrors.length > 0) {
        return false;
      }
      if (this.activeForm === "login") {
        this.login();
      }
      if (this.activeForm === "register") {
        this.register();
      }
    },
    async login() {
      try {
        let loggedUser = await this.$store.dispatch("userLogin", this.user);
        this.user = {
          loggedUser,
          ...this.user
        };
      } catch(error) {
        console.log(error);
      }
    },
    async register() {
      try {
        let newUser = await this.$store.dispatch("userRegister", this.user);
      } catch(error) {
        console.log(error);
        this.$router.push("/");
        return;
      }
    }
  }
};
</script>
<style lang="scss">
#__layout {
  height: 100vh;
}
.jumbotron {
  background-color: #fff;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-control:focus {
  box-shadow: none;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

ul.nav-center {
  display: inline-flex;
}
</style>

