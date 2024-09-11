<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <define-property></define-property>
    <proxy></proxy>
  </div>
</template>

<script>
// @ is an alias to /src
import DefineProperty from './modules/DefineProperty.vue'
import Proxy from './modules/Proxy.vue'

export default {
  name: 'Home',
  components: {
    DefineProperty,
    Proxy
  }
}
</script>
