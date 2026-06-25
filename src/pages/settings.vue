<template>
  <div class="settings-container">
    <h1 class="title">設定</h1>

    <el-radio-group v-model="settings.selectedAlarmId" class="alarm-list">
      <el-card v-for="alarm in settings.alarms" :key="alarm.id" class="alarm-card">
        <div class="alarm-item">
          <div>
            <h3>{{ alarm.name }}</h3>
            <audio controls :src="alarm.file" />
          </div>

          <el-radio :value="alarm.id" />
        </div>
      </el-card>
    </el-radio-group>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
</script>

<style scoped>
.settings-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 24px;
}

.alarm-list {
  display: block;
}

.alarm-card {
  width: 300px;
  margin: 0 auto 16px;
}

.alarm-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

audio {
  width: 200px;
}
</style>
