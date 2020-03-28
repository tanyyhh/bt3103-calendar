<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-card-text>
          <v-container>
            <form align="center" justify="center">
              <v-flex>
                <h1>Sign Up</h1>
              </v-flex>
              <v-layout row>
                <v-icon>email</v-icon>
                <v-flex xs12>
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
                <v-icon>person</v-icon>
                <v-flex xs12>
                  <v-text-field
                    name="name"
                    label="name"
                    id="name"
                    v-model="name"
                    type="name"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-icon>lock</v-icon>
                <v-flex xs12>
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
                <v-icon>lock</v-icon>
                <v-flex xs12>
                  <v-text-field
                    name="confirmPassword"
                    label="Confirm Password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    :rules="[comparePasswords]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit" @click="onSignUp">Sign up</v-btn>
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
import db from "@/fb";

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    };
  },
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Passwords do not match!"
        : "";
    }
  },
  methods: {
    onSignUp(e) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            firebase.auth().currentUser.updateProfile({
              displayName: this.name
            })
            
            console.log(firebase.auth().currentUser);
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                name: this.name,
                email: firebase.auth().currentUser.email,
                uid: firebase.auth().currentUser.uid,
                projects: []

              })
            alert(`Account created for ` + this.email);
            // this.$router.go({ path: this.$router.path });
            this.$router.push('/');
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