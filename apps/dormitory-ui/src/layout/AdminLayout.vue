<script setup lang="ts">
import { ref } from "vue";
import { Menu } from "lucide-vue-next";
import AdminSidebar from "../components/sidebar/AdminSidebar.vue";

const mobileSidebarOpen = ref(false);
</script>

<template>
  <div class="layout">
    <div
      v-if="mobileSidebarOpen"
      class="mobile-overlay"
      @click="mobileSidebarOpen = false"
    ></div>

    <AdminSidebar
      :mobileOpen="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
    />

    <main class="content">
      <div class="mobile-topbar">
        <button class="menu-btn" @click="mobileSidebarOpen = true">
          <Menu :size="20" />
        </button>

        <div class="mobile-brand">DormAnnounce</div>
      </div>

      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
}

.content {
  flex: 1;
  margin-left: 240px;
  min-width: 0;
  padding: 30px;
}

.mobile-topbar {
  display: none;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 900px) {
  .content {
    margin-left: 0;
    padding: 20px 16px 24px;
  }

  .mobile-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .menu-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    border: 1px solid #e5e7eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #1f2937;
  }

  .mobile-brand {
    font-weight: 700;
    color: #111827;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    z-index: 25;
  }
}
</style>
