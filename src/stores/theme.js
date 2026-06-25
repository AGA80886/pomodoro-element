import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const dark = ref(false)

    watch(
      dark,
      (value) => {
        document.documentElement.classList.toggle('dark', value)
      },
      {
        immediate: true,
      },
    )

    return {
      dark,
    }
  },
  {
    persist: true,
  },
)
