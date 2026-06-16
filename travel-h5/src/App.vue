<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

const route = useRoute()
const auth = useAuth()
const active = ref(0)

const showTabbar = () => ['/', '/chat', '/profile', '/travel-logs'].includes(route.path)
</script>

<template>
  <div class="app-container">
    <router-view></router-view>
    <van-tabbar v-if="showTabbar()" route v-model="active">
      <van-tabbar-item to="/" icon="home-o">Home</van-tabbar-item>
      <van-tabbar-item to="/chat" icon="chat-o">Chat</van-tabbar-item>
      <van-tabbar-item :to="auth.state.isAuthenticated ? '/profile' : '/login'" icon="user-o">Profile</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
