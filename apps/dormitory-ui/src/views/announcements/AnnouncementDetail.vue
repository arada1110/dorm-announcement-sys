<template>
    <div class="detail-page">
        <!-- Topbar -->
        <header class="topbar">
            <div class="brand text-base font-semibold">
                <span class="brand-icon">
                    <House :size="18" />
                </span>
                <span>ข่าวสารของหอพัก</span>
            </div>

            <router-link
                :to="`/login?redirect=/resident/announcements/${route.params.id}`"
                class="login-btn text-xs font-medium"
            >
                <ArrowRight :size="16" />
                เข้าสู่ระบบ
            </router-link>
        </header>

        <!-- Content -->
        <main class="content-wrap">
            <router-link to="/announcements" class="back-link">
                <ArrowLeft :size="16" />
                กลับไปหน้าประกาศ
            </router-link>

            <!-- Loading -->
            <div v-if="loading" class="state-card">กำลังโหลดรายละเอียดประกาศ...</div>

            <!-- Detail -->
            <template v-else-if="announcement">
                <section class="headline-card">
                    <span class="hero-kicker text-xs font-medium">
                        <Sparkles :size="14" />
                        รายละเอียดประกาศสาธารณะ
                    </span>

                    <div class="badge-row">
                        <span class="badge text-xs font-medium" :class="categoryMeta.className">
                            {{ categoryMeta.label }}
                        </span>
                    </div>

                    <h1 class="text-2xl font-semibold">
                        {{ announcement.title }}
                    </h1>

                    <div class="meta-row">
                        <span class="meta-item text-xs text-gray-500">
                            <CalendarDays :size="15" />
                            {{ formatDate(announcement.created_at) }}
                        </span>
                    </div>
                </section>

                <section class="content-card">
                    <h2 class="text-base font-semibold text-orange-500">รายละเอียด</h2>

                    <div class="content-body text-base">
                        {{ announcement.content }}
                    </div>
                </section>
            </template>

            <!-- Not found -->
            <div v-else class="state-card">ไม่พบประกาศที่ต้องการ</div>
        </main>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowLeft, ArrowRight, CalendarDays, House, Sparkles } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { getAnnouncementById } from "../../api/announcements.api";
import { useAuthStore } from "../../stores/authStore";

type CategoryName = "GENERAL" | "ROOM" | "BUILDING" | "PAYMENT" | "MAINTENANCE";

interface AnnouncementDetail {
    title: string;
    content: string;
    created_at: string;
    category_name: CategoryName;
}

const route = useRoute();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const announcement = ref<AnnouncementDetail | null>(null);
const loading = ref(true);

const categoryMeta = computed(() => {
    const category = announcement.value?.category_name ?? "GENERAL";

    const map = {
        GENERAL: {
            label: "ข่าวทั่วไป",
            className: "category-general",
        },
        ROOM: {
            label: "ข่าวเฉพาะห้อง",
            className: "category-room",
        },
        BUILDING: {
            label: "ข่าวเฉพาะอาคาร",
            className: "category-building",
        },
        PAYMENT: {
            label: "การชำระเงิน",
            className: "category-payment",
        },
        MAINTENANCE: {
            label: "การซ่อมบำรุง",
            className: "category-maintenance",
        },
    } satisfies Record<CategoryName, { label: string; className: string }>;

    return map[category];
});

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

onMounted(async () => {
    window.scrollTo(0, 0);

    try {
        const res = await getAnnouncementById(route.params.id as string);
        announcement.value = res.data;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.detail-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(254, 215, 170, 0.35), transparent 24%),
        linear-gradient(180deg, #fffaf3 0%, #fffdf8 35%, #fff7ed 100%);
}

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

.brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: #9a3412;
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

.content-wrap {
    max-width: 980px;
    margin: 0 auto;
    padding: 2rem 1.25rem 6rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #9a3412;
    font-weight: 600;
}

.headline-card {
    margin-top: 1rem;
    padding: 1.7rem;
    border-radius: 28px;
    background:
        radial-gradient(circle at top right, rgba(253, 186, 116, 0.52), transparent 36%),
        linear-gradient(135deg, #fff7ed 0%, #fffbeb 55%, #f0fdfa 100%);
    border: 1px solid rgba(251, 146, 60, 0.18);
    box-shadow: 0 18px 40px rgba(251, 146, 60, 0.12);
}

.hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
    color: #c2410c;
}

.badge-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.36rem 0.8rem;
    border-radius: 999px;
}

.category-general {
    background: #e0f2fe;
    color: #0369a1;
}

.category-room {
    background: #ede9fe;
    color: #6d28d9;
}

.category-building {
    background: #dcfce7;
    color: #15803d;
}

.category-payment {
    background: #fee2e2;
    color: #b91c1c;
}

.category-maintenance {
    background: #fef3c7;
    color: #b45309;
}

.meta-row {
    color: #6b7280;
    margin-top: 0.5rem;
}

.meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
}

.content-card,
.state-card {
    margin-top: 1.15rem;
    padding: 1.45rem 1.5rem;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(253, 186, 116, 0.22);
    box-shadow: 0 12px 28px rgba(148, 163, 184, 0.08);
}

.content-body {
    margin-top: 1rem;
    color: #4b5563;
    line-height: 1.9;
    white-space: pre-line;
    overflow-wrap: anywhere;
}

.state-card {
    text-align: center;
    color: #9ca3af;
}
</style>
