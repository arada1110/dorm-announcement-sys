<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserOutlined, LogoutOutlined, BellOutlined, HomeOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();

const active = ref("announcements");

watchEffect(() => {
    if (route.path.includes("announcements")) active.value = "announcements";
    if (route.path.includes("profile")) active.value = "profile";
});

const goAnnouncements = () => router.push("/resident/announcements");
const goProfile = () => router.push("/resident/profile");

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
};
</script>

<template>
    <header class="navbar">
        <div class="navbar-container">
            <!-- LEFT -->
            <div class="navbar-left">
                <div class="logo" @click="goAnnouncements">
                    <HomeOutlined />
                    <span>ข่าวสารของหอพัก</span>
                </div>

                <!-- NAV -->
                <nav class="nav">
                    <div class="nav-item" :class="{ active: active === 'announcements' }" @click="goAnnouncements">
                        ข่าวทั้งหมด
                    </div>

                    <div class="nav-item" :class="{ active: active === 'profile' }" @click="goProfile">
                        ข้อมูลผู้ใช้
                    </div>
                </nav>
            </div>

            <!-- RIGHT -->
            <div class="navbar-right">
                <!-- Notification -->
                <div class="icon-button">
                    <BellOutlined />
                </div>

                <!-- Avatar Dropdown -->
                <a-dropdown placement="bottomRight">
                    <div class="profile">
                        <a-avatar size="small">
                            <UserOutlined />
                        </a-avatar>

                        <span>โปรไฟล์</span>
                    </div>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="goProfile">
                                <UserOutlined />
                                โปรไฟล์
                            </a-menu-item>

                            <a-menu-item @click="logout">
                                <LogoutOutlined />
                                ออกจากระบบ
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* NAVBAR */

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;

    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);

    border-bottom: 1px solid #e5e7eb;
}

/* CONTAINER */

.navbar-container {
    max-width: 1100px;
    margin: auto;

    height: 64px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 24px;
}

/* LEFT */

.navbar-left {
    display: flex;
    align-items: center;
    gap: 40px;
}

/* LOGO */

.logo {
    display: flex;
    align-items: center;
    gap: 8px;

    font-weight: 600;
    font-size: 15px;

    cursor: pointer;

    color: #111827;
}

/* NAV */

.nav {
    display: flex;
    gap: 28px;
}

/* NAV ITEM */

.nav-item {
    font-size: 14px;
    font-weight: 500;

    color: #6b7280;
    cursor: pointer;

    position: relative;
    padding-bottom: 4px;

    transition: color 0.2s;
}

.nav-item:hover {
    color: #111827;
}

/* ACTIVE TAB */

.nav-item.active {
    color: #111827;
}

.nav-item.active::after {
    content: "";

    position: absolute;
    bottom: -12px;
    left: 0;

    width: 100%;
    height: 2px;

    background: #2563eb;

    border-radius: 2px;
}

/* RIGHT */

.navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

/* ICON BUTTON */

.icon-button {
    font-size: 18px;
    color: #6b7280;

    cursor: pointer;

    transition: color 0.2s;
}

.icon-button:hover {
    color: #111827;
}

/* PROFILE */

.profile {
    display: flex;
    align-items: center;
    gap: 8px;

    cursor: pointer;

    font-size: 14px;
    color: #374151;
}
</style>
