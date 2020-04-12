import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Todos from "./views/Todos.vue";
import Team from "./views/Team.vue";
import Calendar from "./views/Calendar.vue";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import firebase from "firebase";
import SelectProject from "./views/SelectProject.vue"

Vue.use(Router);

let router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/dashboard",
            name: "dashboard",
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/signin",
            name: "sign-in",
            component: SignIn,
            meta: {
                requiresGuest: true
            }
        },
        {
            path: "/signup",
            name: "sign-up",
            component: SignUp,
            meta: {
                requiresGuest: true
            }
        },
        {
            path: "/todos",
            name: "todos",
            component: Todos,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/team",
            name: "team",
            component: Team,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/calendar",
            name: "calendar",
            component: Calendar,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/",
            name: "selectProject",
            component: SelectProject,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
    // Check for requiresAuth guard
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if NO logged user
        if (!firebase.auth().currentUser) {
            // Go to sign in
            next({
                path: "/signin",
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            // Proceed to route
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        // Check if NO logged user
        if (firebase.auth().currentUser) {
            // Go to login
            next({
                path: "/",
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            // Proceed to route
            next();
        }
    } else {
        // Proceed to route
        next();
    }
});

export default router;