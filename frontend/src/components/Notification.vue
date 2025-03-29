<template>
    <div class="notification-container">
        <div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
            {{ notification.message }}
        </div>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
}
.notification {
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
}
.success { background: green; }
.error { background: red; }
</style>