<template>
    <div class="resident-page">
        <section class="hero-card">
            <div class="hero-copy">
                <span class="hero-kicker text-xs font-bold">
                    <Sparkles :size="14" />
                    ข่าวสารสำหรับผู้พักอาศัย
                </span>

                <h1 class="text-2xl font-extrabold">ข่าวสารของฉัน</h1>

                <p class="text-sm">
                    รวมประกาศทั่วไปและประกาศเฉพาะห้องไว้ในที่เดียว เพื่อให้คุณติดตามข่าวสำคัญได้ง่ายขึ้นทุกวัน
                </p>
            </div>

            <div class="hero-stats">
                <div class="stat-card">
                    <span class="stat-icon bg-soft-orange">
                        <Megaphone :size="18" />
                    </span>
                    <div>
                        <div class="stat-value text-base font-extrabold">{{ counts.all }}</div>
                        <div class="stat-label text-xs">ประกาศทั้งหมด</div>
                    </div>
                </div>

                <div class="stat-card">
                    <span class="stat-icon bg-soft-yellow">
                        <BellRing :size="18" />
                    </span>
                    <div>
                        <div class="stat-value text-base font-semibold">{{ roomLabel }}</div>
                        <div class="stat-label text-xs">ข่าวที่เกี่ยวข้องกับคุณ</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="toolbar">
            <div class="filter-group">
                <button
                    class="filter-btn text-sm font-bold"
                    :class="{ active: activeFilter === 'ALL' }"
                    @click="activeFilter = 'ALL'"
                >
                    ทั้งหมด
                    <span class="text-xs">{{ counts.all }}</span>
                </button>

                <button
                    class="filter-btn text-sm font-bold"
                    :class="{ active: activeFilter === 'GENERAL' }"
                    @click="activeFilter = 'GENERAL'"
                >
                    ข่าวทั่วไป
                    <span class="text-xs">{{ counts.general }}</span>
                </button>

                <button
                    class="filter-btn text-sm font-bold"
                    :class="{ active: activeFilter === 'ROOM' }"
                    @click="activeFilter = 'ROOM'"
                >
                    เฉพาะห้อง
                    <span class="text-xs">{{ counts.room }}</span>
                </button>
            </div>
        </section>

        <div v-if="loading" class="state-card">กำลังโหลดข่าวสาร...</div>

        <div v-else-if="filteredAnnouncements.length === 0" class="state-card">ยังไม่มีข่าวสารในหมวดนี้</div>

        <div v-else class="announcement-list">
            <router-link
                v-for="item in filteredAnnouncements"
                :key="item.public_id"
                :to="`/resident/announcements/${item.public_id}`"
                class="announcement-link"
            >
                <article class="announcement-card">
                    <div class="badge-row">
                        <span v-if="isNew(item.created_at)" class="badge badge-new">ใหม่</span>

                        <span class="badge text-xs font-bold" :class="getTargetMeta(item.target_type).className">
                            {{ getTargetMeta(item.target_type).label }}
                        </span>

                        <span class="badge text-xs font-bold" :class="getCategoryMeta(item.category_name).className">
                            {{ getCategoryMeta(item.category_name).label }}
                        </span>
                    </div>

                    <h2 class="text-base font-extrabold">{{ item.title }}</h2>

                    <p class="announcement-content text-sm">
                        {{ item.content }}
                    </p>

                    <div class="announcement-footer text-xs">
                        <span class="meta-item">
                            <CalendarDays :size="15" />
                            {{ formatDate(item.created_at) }}
                        </span>

                        <span class="cta-link">
                            อ่านรายละเอียด
                            <ArrowRight :size="16" />
                        </span>
                    </div>
                </article>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ArrowRight, BellRing, CalendarDays, Megaphone, Sparkles } from "lucide-vue-next";
import { getResidentAnnouncements } from "../../api/announcements.api";
import { getMe } from "../../api/authApi";
import { ResidentUser } from "../../models/userModel";
import { formatDate } from "../../helper/formatDate";

type TargetType = "ALL" | "ROOM" | "USER";
type CategoryName = "GENERAL" | "ANNOUNCEMENT" | "EVENT" | "PAYMENT" | "MAINTENANCE";

interface Announcement {
    public_id: string;
    title: string;
    content: string;
    created_at: string;
    category_name: CategoryName;
    target_type: TargetType;
}

const user = ref<ResidentUser | null>(null);

const announcements = ref<Announcement[]>([]);
const loading = ref(true);
const activeFilter = ref<"ALL" | "GENERAL" | "ROOM">("ALL");

const roomLabel = computed(() => (user.value?.room_number ? `ห้อง ${user.value?.room_number}` : "ห้องของคุณ"));

const counts = computed(() => ({
    all: announcements.value.length,
    general: announcements.value.filter((item) => item.target_type === "ALL").length,
    room: announcements.value.filter((item) => item.target_type === "ROOM").length,
}));

const filteredAnnouncements = computed(() => {
    if (activeFilter.value === "GENERAL") {
        return announcements.value.filter((item) => item.target_type === "ALL");
    }

    if (activeFilter.value === "ROOM") {
        return announcements.value.filter((item) => item.target_type === "ROOM");
    }

    return announcements.value;
});

onMounted(async () => {
    try {
        const [announcementsRes, userRes] = await Promise.all([getResidentAnnouncements(), getMe()]);
        announcements.value = announcementsRes.data;
        user.value = userRes.data;
    } finally {
        loading.value = false;
    }
});

function isNew(createdAt: string) {
    const created = new Date(createdAt).getTime();
    const diffHours = (Date.now() - created) / (1000 * 60 * 60);
    return diffHours <= 24;
}

function getCategoryMeta(category: CategoryName) {
    const map = {
        GENERAL: { label: "ข่าวทั่วไป", className: "category-general" },
        ANNOUNCEMENT: { label: "ประกาศสำคัญ", className: "category-annc" },
        EVENT: { label: "กิจกรรม", className: "category-event" },
        PAYMENT: { label: "การชำระเงิน", className: "category-payment" },
        MAINTENANCE: { label: "การซ่อมบำรุง", className: "category-maintenance" },
    } satisfies Record<CategoryName, { label: string; className: string }>;

    return map[category] ?? map.GENERAL;
}

function getTargetMeta(targetType: TargetType) {
    const map = {
        ALL: { label: "ส่งถึงทุกคน", className: "target-all" },
        ROOM: { label: "เฉพาะห้องของคุณ", className: "target-room" },
        USER: { label: "เฉพาะคุณ", className: "target-user" },
    } satisfies Record<TargetType, { label: string; className: string }>;

    return map[targetType] ?? map.ALL;
}
</script>

<style scoped>
.resident-page {
    padding: 0 0 2.5rem;
}

.hero-card {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.9fr);
    gap: 1.25rem;
    padding: 1.75rem;
    border-radius: 28px;
    background:
        radial-gradient(circle at top right, rgba(253, 186, 116, 0.55), transparent 34%),
        linear-gradient(135deg, #fff7ed 0%, #fffbeb 52%, #f0fdfa 100%);
    border: 1px solid rgba(251, 146, 60, 0.18);
    box-shadow: 0 18px 40px rgba(251, 146, 60, 0.12);
    overflow: hidden;
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

.hero-copy h1 {
    margin: 1rem 0 0.65rem;
    color: #1f2937;
    font-weight: 800;
    line-height: 1.08;
}

.hero-copy p {
    max-width: 40rem;
    color: #6b7280;
    line-height: 1.75;
}

.hero-stats {
    display: grid;
    gap: 0.9rem;
    align-content: center;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.05rem;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(255, 237, 213, 0.9);
}

.stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 18px;
    color: #9a3412;
}

.bg-soft-orange {
    background: #ffedd5;
}

.bg-soft-yellow {
    background: #fef3c7;
}

.stat-value {
    color: #1f2937;
}

.stat-label {
    color: #6b7280;
}

.toolbar {
    margin: 1.5rem 0 1rem;
}

.filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.78rem 1rem;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #fed7aa;
    color: #9a3412;
    transition: 0.2s ease;
}

.filter-btn span {
    min-width: 1.75rem;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: #fff7ed;
    color: #c2410c;
}

.filter-btn:hover,
.filter-btn.active {
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    border-color: #f97316;
    color: #fff;
    box-shadow: 0 14px 24px rgba(249, 115, 22, 0.22);
}

.filter-btn:hover span,
.filter-btn.active span {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
}

.state-card {
    padding: 1.35rem 1.5rem;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px dashed #fdba74;
    color: #9ca3af;
    text-align: center;
}

.announcement-list {
    display: grid;
    gap: 1rem;
}

.announcement-link {
    display: block;
}

.announcement-card {
    padding: 1.35rem 1.4rem;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 250, 245, 0.96));
    border: 1px solid rgba(253, 186, 116, 0.32);
    box-shadow: 0 12px 28px rgba(148, 163, 184, 0.08);
    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
}

.announcement-card:hover {
    transform: translateY(-2px);
    border-color: #fb923c;
    box-shadow: 0 18px 34px rgba(249, 115, 22, 0.14);
}

.badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.9rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.78rem;
    border-radius: 999px;
}

.badge-new {
    background: #f43f5e;
    color: #fff;
}

.target-all {
    background: #ffedd5;
    color: #c2410c;
}

.target-room {
    background: #ccfbf1;
    color: #0f766e;
}

.target-user {
    background: #dbeafe;
    color: #1d4ed8;
}

.category-general {
    background: #e0f2fe;
    color: #0369a1;
}

.category-annc {
    background: #ede9fe;
    color: #6d28d9;
}

.category-event {
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

.announcement-card h2 {
    color: #1f2937;
}

.announcement-content {
    margin-top: 0.65rem;
    color: #6b7280;
    line-height: 1.75;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
}

.announcement-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
    color: #9ca3af;
}

.meta-item,
.cta-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
}

.cta-link {
    color: #f97316;
    font-weight: 700;
}

@media (max-width: 900px) {
    .hero-card {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .hero-card {
        padding: 1.25rem;
        border-radius: 24px;
    }

    .announcement-card {
        padding: 1.15rem;
    }

    .announcement-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
