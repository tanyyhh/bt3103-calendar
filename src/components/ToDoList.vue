<template>
    <div class="todolist">
        <header> {{title}} </header>
        <ol>
            <li v-for="todo in todos" v-bind:key="todo.title">
                <span :class="{ done: todo.done }"> {{todo.title}} </span>
            </li>
        </ol>
    </div>
    
</template>

<script>
import db from "@/fb";
    export default {
        data() {
            return {
                title: 'To Do List',
                newTodo: '',
                todos: []
            }
        },
        created() {
            db.collection("projects")
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const data = {
                        title: doc.data().title,
                        done: doc.data().status
                        };
                        this.todos.push(data);
                    });
                });
            console.log(this.todos)
        },

        methods: {
            addTodo: function() {
                this.todos.push({
                    title: this.newTodo,
                    done: false
                });
                this.newTodo = '';
            },
            removeTodo: function(todo) {
                const todoIndex = this.todos.indexOf(todo);
                this.todos.splice(todoIndex, 1);
            },
            allDone: function() {
                this.todos.forEach(todo => {
                todo.done = true;
                });
            },
            removeAll: function() {
                this.todos = [];
            }
        }
    } 
</script>

<style scoped>
    .todolist {
        transform: translate(0%, 0%);
        /* margin-top: 50px; */
        margin-bottom: 10px;
        border: 10;
        border-radius: .50em;
        background: initial;
        background-color: rgb(212, 246, 248);
        color: rgb(14, 13, 13);
        font-size: 1.0625em;
        text-align: center;
    }
    
</style>