<template>
  <el-container class="pomodoro-container">
    <div class="timer-box">
      <DigitNumber
        v-for="(text, idx) in timeleftText"
        :key="idx"
        :color="theme.dark ? '#00ff66' : '#1976d2'"
        :data="text"
      />
    </div>

    <div class="task-box">
      <h1>
        {{ list.currentItem || '沒有事項' }}
      </h1>
    </div>

    <div class="btn-box">
      <el-button
        type="success"
        circle
        :disabled="
          status === STATUS.COUNTING || (list.currentItem.length === 0 && list.items.length === 0)
        "
        @click="startTimer"
      >
        <el-icon><VideoPlay /></el-icon>
      </el-button>

      <el-button type="warning" circle :disabled="status !== STATUS.COUNTING" @click="pauseTimer">
        <el-icon><VideoPause /></el-icon>
      </el-button>

      <el-button type="danger" circle :disabled="list.currentItem.length === 0" @click="finish">
        <el-icon><DArrowRight /></el-icon>
      </el-button>
    </div>
  </el-container>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useWebNotification } from '@vueuse/core'
import DigitNumber from '@/components/DigitNumber.vue'

import { useListStore } from '@/stores/list'
import { useSettingsStore } from '@/stores/settings'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'

import { VideoPlay, VideoPause, DArrowRight } from '@element-plus/icons-vue'

const list = useListStore()
const time = useTimeStore()
const settings = useSettingsStore()
const theme = useThemeStore()

const timeleftText = computed(() => {
  const m = Math.floor(time.timeleft / 60)
    .toString()
    .padStart(2, '0')

  const s = (time.timeleft % 60).toString().padStart(2, '0')

  return m + ':' + s
})

const STATUS = {
  STOP: 0,
  COUNTING: 1,
  PAUSE: 2,
}

const status = ref(STATUS.STOP)
let timer = 0

const startTimer = () => {
  if (status.value === STATUS.STOP && list.currentItem === '') {
    list.currentItem = time.isBreakTime ? '休息一下' : list.items.shift()?.text || ''
  }

  status.value = STATUS.COUNTING

  timer = setInterval(() => {
    time.timeleft--

    if (time.timeleft <= 0) {
      finish()
    }
  }, 1000)
}

const finish = () => {
  clearInterval(timer)
  status.value = STATUS.STOP
  const audio = new Audio()
  audio.src = settings.selectedAlarm.file
  audio.play()

  const { show, isSupported, permissionGranted } = useWebNotification({
    title: '事項完成',
    body: list.currentItem,
    icon: new URL('@/assets/food.png', import.meta.url).href,
  })
  if (isSupported.value && permissionGranted.value) {
    show()
  }

  if (!time.isBreakTime) {
    list.finishedItems.push({
      id: list.id++,
      text: list.currentItem,
    })
  }

  list.currentItem = ''

  if (list.items.length > 0) {
    time.isBreakTime = !time.isBreakTime
  }

  time.timeleft = time.isBreakTime ? time.TIME_BREAK : time.TIME

  if (list.items.length > 0) {
    startTimer()
  }
}

const pauseTimer = () => {
  clearInterval(timer)
  status.value = STATUS.PAUSE
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
/* 讓整個容器變成垂直排列，且水平置中 */
.pomodoro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

/* 數字置中 */
.timer-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
}

/* 文字置中 */
.task-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.task-box h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
}

/* 按鈕置中 */
.btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 30px;
}
</style>

<route lang="yaml">
meta:
  title: 首頁
</route>
