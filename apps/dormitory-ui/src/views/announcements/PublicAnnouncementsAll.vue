<template>
    <div class="public-page">
        <!-- TOPBAR -->

        <header class="topbar">
            <div class="brand text-base font-semibold">
                <span class="brand-icon">
                    <House :size="18" />
                </span>

                <router-link to="/" class="brand-text"> ข่าวสารของหอพัก </router-link>
            </div>

            <router-link to="/login" class="login-btn text-xs font-medium">
                <ArrowRight :size="16" />
                เข้าสู่ระบบ
            </router-link>
        </header>

        <!-- CONTENT -->

        <main class="content-wrap">
            <section class="section-head">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-800">ข่าวทั้งหมดของหอพัก</h1>

                    <p class="text-xs text-gray-500 mt-1">รวมประกาศข่าวสารทั้งหมดที่เปิดให้ผู้พักอาศัยติดตามได้</p>
                </div>
            </section>

            <!-- BACK LINK -->

            <router-link to="/announcements" class="back-link text-xs">
                <ArrowLeft :size="16" />
                กลับไปหน้าประกาศ
            </router-link>

            <!-- STATES -->

            <div v-if="loading" class="state-card">กำลังโหลดประกาศ...</div>

            <div v-else-if="announcements.length === 0" class="state-card">ยังไม่มีประกาศ</div>

            <!-- LIST -->

            <div v-else>
                <div class="announcement-list">
                    <router-link
                        v-for="item in paginatedAnnouncements"
                        :key="item.public_id"
                        :to="`/announcements/${item.public_id}`"
                        class="announcement-link"
                    >
                        <AnnouncementNewCard
                            :title="item.title"
                            :content="item.content"
                            :createdAt="item.created_at"
                            :categoryName="item.category_name"
                        />
                    </router-link>
                </div>

                <!-- PAGINATION -->

                <div class="flex justify-center items-center gap-4 mt-6">
                    <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40"
                    >
                        ก่อนหน้า
                    </button>

                    <span class="text-xs text-gray-500"> หน้า {{ currentPage }} / {{ totalPages }} </span>

                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ArrowRight, House, ArrowLeft } from "lucide-vue-next";
import { getPublicAnnouncements } from "../../api/announcements.api";
import AnnouncementNewCard from "../../components/announcement/AnnouncementNewCard.vue";

interface Announcement {
    public_id: string;
    title: string;
    content: string;
    created_at: string;
    category_name: string;
}

const announcements = ref<Announcement[]>([]);
const loading = ref(true);

// pagination state
const currentPage = ref(1);
const pageSize = 5;

const totalPages = computed(() => Math.ceil(announcements.value.length / pageSize));

const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return announcements.value.slice(start, start + pageSize);
});

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

onMounted(async () => {
    try {
        const res = await getPublicAnnouncements();
        announcements.value = res.data;
    } finally {
        loading.value = false;
    }
});
</script>
<style scoped>
.public-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(254, 215, 170, 0.35), transparent 24%),
        linear-gradient(180deg, #fffaf3 0%, #fffdf8 35%, #fff7ed 100%);
}

/* TOPBAR */

.topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    backdrop-filter: blur(10px);
    background: rgba(255, 251, 245, 0.92);
    border-bottom: 1px solid rgba(251, 146, 60, 0.18);
    box-shadow: 0 10px 30px rgba(249, 115, 22, 0.08);
}

/* BRAND */

.brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: #9a3412;
}

.brand-text {
    text-decoration: none;
    color: inherit;
}

.brand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 14px;
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: #fff;
    box-shadow: 0 12px 20px rgba(249, 115, 22, 0.2);
}

/* LOGIN BUTTON */

.login-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border-radius: 999px;
    padding: 0.8rem 1.15rem;
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: #fff;
    box-shadow: 0 12px 20px rgba(249, 115, 22, 0.18);
}

.login-btn:hover {
    transform: translateY(-1px);
}

/* CONTENT */

.content-wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
}

/* STATES */

.state-card {
    padding: 1.35rem 1.5rem;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px dashed #fdba74;
    color: #9ca3af;
    text-align: center;
}

/* LIST */

.announcement-list {
    margin-top: 1.25rem;
    display: grid;
    gap: 1rem;
}

.announcement-link {
    display: block;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #9a3412;
    font-weight: 600;
    margin-top: 0.75rem;
}
</style>
