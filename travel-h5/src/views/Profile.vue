<template>
  <!-- 个人中心页面主容器 -->
  <div class="profile-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="个人中心" fixed />
    
    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-avatar">
        <van-image 
          round 
          width="80" 
          height="80" 
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          fit="cover"
        />
      </div>
      <div class="user-details">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-id">ID: {{ userInfo.id }}</div>
      </div>
      <van-icon name="arrow" class="arrow-icon" />
    </div>
    
    <!-- 统计数据区域 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.trips }}</div>
        <div class="stat-label">行程数</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.cities }}</div>
        <div class="stat-label">去过城市</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.points }}</div>
        <div class="stat-label">积分</div>
      </div>
    </div>
    
    <!-- 功能菜单区域 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell 
          title="我的行程" 
          icon="notes-o" 
          is-link 
          @click="handleMenuClick('trips')"
        />
        <van-cell 
          title="收藏景点" 
          icon="star-o" 
          is-link 
          @click="handleMenuClick('favorites')"
        />
        <van-cell 
          title="我的订单" 
          icon="balance-list-o" 
          is-link 
          @click="handleMenuClick('orders')"
        />
        <van-cell 
          title="积分商城" 
          icon="gift-o" 
          is-link 
          @click="handleMenuClick('points')"
        />
      </van-cell-group>
    </div>
    
    <!-- 设置菜单区域 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell 
          title="账号设置" 
          icon="user-o" 
          is-link 
          @click="handleMenuClick('account')"
        />
        <van-cell 
          title="消息通知" 
          icon="bell" 
          is-link 
          @click="handleMenuClick('notifications')"
        />
        <van-cell 
          title="帮助中心" 
          icon="question-o" 
          is-link 
          @click="handleMenuClick('help')"
        />
        <van-cell 
          title="关于我们" 
          icon="info-o" 
          is-link 
          @click="handleMenuClick('about')"
        />
      </van-cell-group>
    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <van-button 
        type="default" 
        block 
        round 
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>
    
    <!-- 底部TabBar占位符 -->
    <div class="tabbar-placeholder"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

// 初始化路由
const router = useRouter()

// 用户信息数据
const userInfo = ref({
  name: '旅行达人',
  id: '10001',
  trips: 12,
  cities: 8,
  points: 2580
})

/**
 * 处理菜单项点击
 * @param {string} menu - 菜单类型
 */
const handleMenuClick = (menu) => {
  showToast(`点击了: ${menu}`)
  // 根据不同菜单跳转到对应页面
  // router.push(`/profile/${menu}`)
}

/**
 * 退出登录
 */
const handleLogout = () => {
  showToast('退出登录成功')
  // 清除登录状态，跳转到登录页
  // router.push('/login')
}
</script>

<style scoped>
/* 个人中心页面整体布局 */
.profile-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px; /* 给顶部导航栏预留空间 */
}

/* 用户信息区域 */
.user-info-section {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background-color: #fff;
  margin-bottom: 12px;
}

/* 用户头像 */
.user-avatar {
  margin-right: 16px;
}

/* 用户详情 */
.user-details {
  flex: 1;
}

/* 用户名称 */
.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

/* 用户ID */
.user-id {
  font-size: 14px;
  color: #969799;
}

/* 箭头图标 */
.arrow-icon {
  color: #969799;
  font-size: 16px;
}

/* 统计数据区域 */
.stats-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px;
  background-color: #fff;
  margin-bottom: 12px;
}

/* 统计项 */
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 统计数值 */
.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: #323233;
}

/* 统计标签 */
.stat-label {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

/* 统计分隔线 */
.stat-divider {
  width: 1px;
  height: 30px;
  background-color: #ebedf0;
}

/* 功能菜单区域 */
.menu-section {
  margin-bottom: 12px;
}

/* 退出登录区域 */
.logout-section {
  padding: 32px 16px;
}

/* 底部TabBar占位符 */
.tabbar-placeholder {
  height: 50px;
}
</style>