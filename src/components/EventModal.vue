<template>
    <div>
        {{text}}
        <fieldset>
            <legend>Event details</legend>

        <b>Title:</b> {{ event.title }} <br/>
        <b>Start:</b> {{ event.start }} <br/>
        <b>End:</b> {{ event.end }} <br/>
        <b>ID:</b> {{ event.id }} <br/>
        </fieldset>
    </div>
</template>

<script>

export default {
    computed: {
        props: {
            text: String,
            event: Object
        }
    },
    
}
</script>

<style>

</style>