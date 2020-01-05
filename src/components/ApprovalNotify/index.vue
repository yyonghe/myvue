<template>
  <div>
    <el-select v-model="notify.type" style="width:100%">
      <el-option label="不回调" :value="0" />
      <el-option label="HTTP回调" :value="1" />
      <el-option label="TRPC回调" :value="2" />
      <el-option label="ILIVE回调" :value="3" />
    </el-select>
    <div v-if="notify.type==1" style="margin-top: 5px;">
      <el-input v-model="notify.url" style="width:100%" placeholder="请输入完整回调URL" />
    </div>
    <div v-else-if="notify.type==2" style="margin-top: 5px;">
      <el-input v-model="notify.serverName" style="width:100%" placeholder="请输入TRPC服务名" />
    </div>
    <div v-else-if="notify.type==3" style="margin-top: 5px;">
      <el-input v-model="notify.l5" style="width:100%" placeholder="请输入ILIVE服务L5(MODID:CMDID)" />
      <el-input v-model="notify.cmd" style="width:100%" placeholder="请输入ILIVE服务大命令字" />
      <el-input v-model="notify.subcmd" style="width:100%" placeholder="请输入ILIVE服务小命令字" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notify: {
      type: Object,
      default: () => {
        return {
          type: 0
        }
      }
    }
  }
}

</script>

<style scoped>

</style>
