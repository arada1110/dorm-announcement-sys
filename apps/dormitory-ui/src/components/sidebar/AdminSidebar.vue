<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Bell, ChartColumn, KeyRound, LogOut, House, X, Settings } from "lucide-vue-next";
import ConfirmLogoutModal from "./ConfirmLogoutModal.vue";

const props = withDefaults(
    defineProps<{
        mobileOpen?: boolean;
    }>(),
    {
        mobileOpen: false,
    }
);

const emit = defineEmits(["close"]);

const router = useRouter();
const route = useRoute();
const showLogoutModal = ref(false);

const handleNavigate = (path: string) => {
    router.push(path);
    emit("close");
};

const openLogoutModal = () => {
    showLogoutModal.value = true;
};

const closeLogoutModal = () => {
    showLogoutModal.value = false;
};

const confirmLogout = () => {
    showLogoutModal.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
    emit("close");
};
</script>

<template>
    <aside class="sidebar" :class="{ 'mobile-open': props.mobileOpen }">
        <div class="sidebar-top">
            <div class="logo">
                <div class="logo-icon">
                    <House :size="18" />
                </div>

                <div>
                    <p class="font-semibold">DormAnnounce</p>
                    <p class="text-xs text-gray-400">ระบบประกาศหอพัก</p>
                </div>
            </div>

            <button class="mobile-close" @click="emit('close')">
                <X :size="20" />
            </button>
        </div>

        <nav class="menu">
            <div
                class="menu-item"
                :class="{ active: route.path.includes('dashboard') }"
                @click="handleNavigate('/admin/dashboard')"
            >
                <ChartColumn :size="16" />
                <span>แดชบอร์ด</span>
            </div>

            <div
                class="menu-item"
                :class="{ active: route.path.includes('announcements') }"
                @click="handleNavigate('/admin/announcements')"
            >
                <Bell :size="16" />
                <span>จัดการประกาศ</span>
            </div>

            <div
                class="menu-item"
                :class="{ active: route.path.includes('invites') }"
                @click="handleNavigate('/admin/invites')"
            >
                <KeyRound :size="16" />
                <span>รหัสเชิญ</span>
            </div>
        </nav>

        <div class="bottom-section">
            <div
                class="menu-item"
                :class="{ active: route.path.includes('settings') }"
                @click="handleNavigate('/admin/settings')"
            >
                <Settings :size="16" />
                <span>ตั้งค่า LINE OA</span>
            </div>

            <div class="logout" @click="openLogoutModal">
                <LogOut :size="16" />
                <span>ออกจากระบบ</span>
            </div>
        </div>
    </aside>

    <ConfirmLogoutModal v-if="showLogoutModal" @cancel="closeLogoutModal" @confirm="confirmLogout" />
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    height: 100vh;
    background: white;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    overflow-y: auto;
    z-index: 30;
    transition: transform 0.25s ease;
}

.sidebar-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.logo {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 30px;
}

.logo-icon {
    width: 36px;
    height: 36px;
    background: #1e293b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    flex-shrink: 0;
}

.mobile-close {
    display: none;
    color: #374151;
    align-items: center;
    justify-content: center;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    color: #374151;
    font-size: 14px;
}

.menu-item:hover {
    background: #f3f4f6;
}

.menu-item.active {
    background: #1e293b;
    color: white;
}

.logout {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border-top: 1px solid #eee;
    cursor: pointer;
    color: #6b7280;
}

.logout:hover {
    color: #ef4444;
}

.bottom-section {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

@media (max-width: 900px) {
    .sidebar {
        transform: translateX(-100%);
        width: min(280px, 84vw);
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);
    }

    .sidebar.mobile-open {
        transform: translateX(0);
    }

    .mobile-close {
        display: inline-flex;
    }
}
</style>
