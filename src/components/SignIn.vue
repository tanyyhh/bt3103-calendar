<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-card-text>
          <v-container>
            <form align="center" justify="center">
              <v-flex>
                <h1>Sign in</h1>
              </v-flex>
              <v-layout row>
                <v-icon>email</v-icon>
                <v-flex md12>
                  <v-text-field
                    name="email"
                    label="Email address"
                    id="email"
                    v-model="email"
                    type="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-icon>lock</v-icon>
                <v-flex md12>
                  <v-text-field
                    name="password"
                    label="Password"
                    id="password"
                    v-model="password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit" v-on:click="onSignIn">Sign in</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: "signIn",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    onSignIn(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            alert(`You are logged in as ` + this.email);
            this.$router.go({ path: this.$router.path });
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};
</script>

<style lang="stylus"></style>