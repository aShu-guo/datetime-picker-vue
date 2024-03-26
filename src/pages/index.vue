<template>
  <div>
    <h1>
      Component:
    </h1>
    <DatetimePickerVue
      v-model="date"
    />
  </div>
</template>

<script>
  import DatetimePickerVue from '../DatetimePickerVue'

  export default {
    components: {
      DatetimePickerVue
    },
    data () {
      return {
        date: null
      }
    }
  }
</script>
