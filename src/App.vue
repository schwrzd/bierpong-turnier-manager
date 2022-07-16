<template>
  <v-app>
    <router-view name="toolbar"></router-view>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "App",
  created() {
    document.title = "Bierpong-Turnier-Manager";
  },
};
</script>
