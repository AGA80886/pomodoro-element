<template>
  <el-container class="layout">
    <el-header class="header">
      <h2>🍅 番茄鐘</h2>

      <router-link to="/">
        <el-button>
          <el-icon><House /></el-icon>
          首頁
        </el-button>
      </router-link>

      <router-link to="/list">
        <el-button>
          <el-icon><List /></el-icon>
          事項
        </el-button>
      </router-link>

      <router-link to="/settings">
        <el-button>
          <el-icon><Setting /></el-icon>
          設定
        </el-button>
      </router-link>
      <div class="spacer"></div>

      <el-switch v-model="theme.dark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" />
    </el-header>

    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive include="index">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-main>

    <el-footer class="footer">
      <a href="https://www.flaticon.com/free-icons/pomodoro" target="_blank">
        Pomodoro icons created by Atif Arshad - Flaticon
      </a>
    </el-footer>
  </el-container>
</template>

<script setup>
import { House, List, Setting } from '@element-plus/icons-vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h2 {
  margin-right: 20px;
}

.footer {
  text-align: center;
}

.spacer {
  flex: 1;
}
</style>
