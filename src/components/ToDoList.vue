<template>
    <div class="todolist">
        <header> {{title}} </header>
        <form @submit.prevent="addTodo">
            <label for="newTodo"></label>
            <input v-model="newTodo" type="text" name="newTodo" id="newTodo" value="" placeholder="New task">
            <button type="submit" name="button">Add Task</button>
         </form>
        <button @click="allDone" type="button" name="button">All Done</button>
        <button @click ='removeAll' type = 'button' name='button2'> Remove All</button>
        <ul>
            <li v-for="todo in todos" v-bind:key="todo">
                <input type="checkbox" v-model="todo.done">
                <span :class="{ done: todo.done }"> {{todo.title}} </span>
                <button @click="removeTodo(todo)" type="button" name="button">Remove</button>
            </li>
        </ul>
    </div>
    
</template>

<script>
    export default {
        data() {
            return {
                title: 'To Do List',
                newTodo: '',
                todos: []
            }
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