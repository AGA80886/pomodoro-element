<template>
  <h1 class="title">未完成</h1>
  <el-input v-model="newItem" placeholder="請輸入事項" clearable @keyup.enter="addItem">
    <template #append>
      <el-button @click="addItem">
        <el-icon><Plus /></el-icon>
      </el-button>
    </template>
  </el-input>

  <el-table :data="list.items" border>
    <el-table-column label="名稱">
      <template #default="{ row }">
        <el-input v-if="row.edit" v-model="row.model" @keyup.enter="submitEditItem(row)" />
        <span v-else>{{ row.text }} </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="{ row }">
        <template v-if="row.edit">
          <el-button circle type="warning" @click="cancelEditItem(row)">
            <el-icon><RefreshLeft /></el-icon>
          </el-button>

          <el-button circle type="success" @click="submitEditItem(row)">
            <el-icon><Check /></el-icon>
          </el-button>
        </template>

        <template v-else>
          <el-button circle type="primary" @click="editItem(row)">
            <el-icon><Edit /></el-icon>
          </el-button>

          <el-button circle type="danger" @click="delItem(row.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>

  <h1 class="title">已完成</h1>
  <el-table :data="list.finishedItems" border>
    <el-table-column prop="text" label="名稱" />

    <el-table-column label="操作" width="120">
      <template #default="{ row }">
        <el-button circle type="danger" @click="delFinishedItem(row.id)">
          <el-icon>
            <Delete />
          </el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { useListStore } from '@/stores/list'
import { Plus, Edit, Delete, Check, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const list = useListStore()
const newItem = ref('')
const addItem = () => {
  if (newItem.value.trim().length < 3) {
    ElMessage.error('事項至少需要 3 個字')
    return
  }

  list.items.push({
    id: list.id++,
    text: newItem.value,
    edit: false,
    model: newItem.value,
  })

  newItem.value = ''
}

const submitEditItem = (item) => {
  if (item.model.trim().length < 3) {
    ElMessage.error('事項至少需要 3 個字')
    return
  }

  item.text = item.model
  item.edit = false
}

const delItem = (id) => {
  const idx = list.items.findIndex((item) => item.id === id)
  if (idx > -1) list.items.splice(idx, 1)
}

const editItem = (item) => {
  item.edit = true
}

const cancelEditItem = (item) => {
  item.edit = false
  item.model = item.text
}

const delFinishedItem = (id) => {
  const idx = list.finishedItems.findIndex((item) => item.id === id)
  if (idx > -1) list.finishedItems.splice(idx, 1)
}
</script>

<style scoped>
.title {
  text-align: center;
  margin: 20px 0;
}

.el-input {
  margin-bottom: 20px;
}

.el-table {
  margin-bottom: 30px;
}
</style>

<route lang="yaml">
meta:
  title: 事項
</route>
