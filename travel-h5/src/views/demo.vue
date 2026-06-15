<template>
   <div class="page-container caht-page">
    <div class="page-header">
      <van-nav-bar 
      title="AI旅游助手"
      left-arrow
      left-text="返回"
      @click-left="onBack"
      fixed
      top="0"
      />
    </div>

    <div class="chat-container">
      <div v-if="message.length === 0" class="chat-empty">
        <van-empty 
            description="开始和AI助手对话吧！"
                   />
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag @click="handleClickTag(q)" v-for="q in quickTags" :key="q" size="large" mark class="quick-tag">
            {{ q }}
          </van-tag>
        </div>
      </div>
      <div v-else class="message-list">
        <div v-for="item in message" :key="item.id" class="message-item" :class="item.role">
          <div class="message-content">{{ item.content }}</div>
        </div>
      </div>
     </div>

      <div class="caht-input-area">
    <van-field
      v-model="inputMessage"
      placeholder="老baby你有什么问题"
      @keyup.enter="sendMessage"
     >
        <template #button>
           <van-button type="primary" size="small" :disabled="inputMessage.trim() === ''"   @click="sendMessage">
             发送
           </van-button>
          </template>
      </van-field>
    </div>
   </div>
</template>
<script setup>
import { ref } from 'vue'
import { fetchStream } from '../utils/request'
import {useRouter} from "vue-router"
const router = useRouter()


// 点击常见问题标签
const handleClickTag = (tag) => {
  console.log(tag)
}

// 输入框内容
const inputMessage = ref('')

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: inputMessage.value
  }
  message.value.push(userMessage)

  const content = inputMessage.value
  inputMessage.value = ''
  isStreaming.value = true

  let aiResponse = ''
  const aiMessage = {
    id: Date.now() + 1,
    role: 'assistant',
    content: ''
  }
  message.value.push(aiMessage)

  fetchStream('chat', { message: content },
    (chunk) => {
      aiResponse += chunk
      aiMessage.content = aiResponse
    },
    (error) => {
      console.error('Error:', error)
      aiMessage.content = '抱歉，发生了错误'
    },
    () => {
      isStreaming.value = false
    }
  )
}



// 常见问题标签
const quickTags = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
])



// 对话记录
const message = ref([])


const onBack = () => {
  router.back()
}

// AI处理状态
const isStreaming = ref(false)



</script>


<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 50px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 60px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
}
</style>