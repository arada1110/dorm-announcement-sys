<template>
    <header class="navbar">
        <div class="container">
            <div class="logo" @click="router.push('/resident/announcements')">
                <House :size="18" />
                <span>ข่าวสารของหอพัก</span>
            </div>

            <nav class="nav">
                <div
                    class="nav-item"
                    :class="{ active: active === 'announcements' }"
                    @click="router.push('/resident/announcements')"
                >
                    ข่าวสาร
                </div>

                <div
                    class="nav-item"
                    :class="{ active: active === 'profile' }"
                    @click="router.push('/resident/profile')"
                >
                    โปรไฟล์
                </div>
            </nav>

            <button class="logout" @click="showLogoutModal = true">ออกจากระบบ</button>
        </div>
    </header>
    <ResidentLogoutConfirmModal v-if="showLogoutModal" @confirm="handleLogout" @cancel="showLogoutModal = false" />
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
import { House } from "lucide-vue-next";
import ResidentLogoutConfirmModal from "../modal/ResidentLogoutConfirmModal.vue";

const router = useRouter();
const route = useRoute();

const active = ref("announcements");
const showLogoutModal = ref(false);

watchEffect(() => {
    if (route.path.includes("announcements")) active.value = "announcements";
    if (route.path.includes("profile")) active.value = "profile";
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/");
};
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    backdrop-filter: blur(10px);
    background: rgba(255, 251, 245, 0.92);
    border-bottom: 1px solid rgba(251, 146, 60, 0.18);
    box-shadow: 0 10px 30px rgba(249, 115, 22, 0.08);
    z-index: 50;
}

.container {
    max-width: 1100px;
    margin: auto;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.nav {
    display: flex;
    gap: 30px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #9a3412;
    font-weight: 800;
}

.nav-item {
    cursor: pointer;
    color: #6b7280;
    font-weight: 600;
    transition: 0.2s ease;
}

.nav-item:hover {
    color: #ea580c;
}

.nav-item.active {
    color: #ea580c;
    font-weight: 700;
}

.logout {
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: white;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    transition: 0.2s ease;
    box-shadow: 0 12px 20px rgba(249, 115, 22, 0.18);
}

.logout:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 26px rgba(249, 115, 22, 0.24);
}

@media (max-width: 640px) {
    .container {
        padding: 0 14px;
        gap: 12px;
    }

    .nav {
        gap: 16px;
    }

    .logo span,
    .logout {
        font-size: 13px;
    }
}
</style>
