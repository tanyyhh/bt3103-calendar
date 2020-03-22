<template>
  <div id = 'wrapper'>
    <div id = "app">
      <Agenda></Agenda>
    </div>
    <br>
    <!-- <div id="btm">
      <div id = "ml"> 
      <MemberList></MemberList> 
      </div>
      <div id = 'tdl'>
      <ToDoList></ToDoList>
      </div>
    </div> -->
    
  </div>
</template>

<script>
import Agenda from '../components/Agenda'
// import MemberList from './components/MemberList'
// import ToDoList from '../components/ToDoList'

export default {
  name: 'Calendar',
  components: {
    Agenda
    //MemberList,
    // ToDoList
  }
}
</script>

<style>
#btm {
  display: flex;
  justify-content: center;
}

#ml {
  width: 100px;
  margin-top: 1000px;
}

#tdl{
  flex-grow: 0.1;
}


</style>