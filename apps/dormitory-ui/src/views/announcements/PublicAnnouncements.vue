<template>
    <div class="public-page">
        <header class="topbar">
            <div class="brand text-base font-semibold">
                <span class="brand-icon">
                    <House :size="18" />
                </span>
                <span>ข่าวสารของหอพัก</span>
            </div>

            <router-link to="/login" class="login-btn text-xs font-medium">
                <ArrowRight :size="16" />
                เข้าสู่ระบบ
            </router-link>
        </header>

        <main class="content-wrap">
            <section class="hero-card">
                <div class="hero-copy">
                    <span class="hero-kicker text-xs font-medium">
                        <Sparkles :size="14" />
                        กระดานข่าวหอพัก
                    </span>

                    <h1 class="text-2xl font-semibold">ประกาศข่าวสารสำหรับผู้พักอาศัย</h1>

                    <p class="text-base text-gray-600">
                        ติดตามข่าวทั่วไปจากหอพักได้ทันทีจากหน้า public นี้ และหากเข้าสู่ระบบ
                        คุณจะเห็นประกาศที่เกี่ยวข้องกับห้องของคุณแบบครบถ้วนยิ่งขึ้น
                    </p>

                    <div class="hero-actions">
                        <router-link to="/login" class="primary-btn text-xs font-medium">
                            เข้าสู่ระบบเพื่อดูข่าวเฉพาะห้อง
                        </router-link>
                    </div>
                </div>

                <div class="hero-stats">
                    <div class="stat-card">
                        <span class="stat-icon soft-orange">
                            <Megaphone :size="18" />
                        </span>
                        <div>
                            <div class="stat-value text-base font-semibold">
                                {{ latestCount }}
                            </div>

                            <div class="stat-label text-xs text-gray-500">ประกาศสาธารณะล่าสุด</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <span class="stat-icon soft-mint">
                            <BellRing :size="18" />
                        </span>
                        <div>
                            <div class="stat-value text-base font-semibold">LINE แจ้งเตือน</div>

                            <div class="stat-label text-xs text-gray-500">เข้าสู่ระบบเพื่อรับประกาศได้เร็วขึ้น</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section-head">
                <div>
                    <h2 class="text-base font-semibold">ประกาศล่าสุด</h2>

                    <p class="text-xs text-gray-500">ข่าวสาธารณะที่เปิดให้ทุกคนติดตามได้</p>
                </div>

                <router-link to="/announcements/all" class="show-all-btn text-xs font-medium">
                    ดูข่าวทั้งหมด
                </router-link>
            </section>

            <div v-if="loading" class="state-card">กำลังโหลดประกาศ...</div>

            <div v-else-if="announcements.length === 0" class="state-card">ยังไม่มีประกาศในขณะนี้</div>

            <div v-else class="announcement-list">
                <router-link
                    v-for="item in announcements"
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
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowRight, BellRing, House, Megaphone, Sparkles } from "lucide-vue-next";
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
const showAll = ref(false);

const latestCount = computed(() => announcements.value.length);
const visibleAnnouncements = computed(() => {
    if (showAll.value) return announcements.value;
    return announcements.value.slice(0, 5);
});

const toggleShowAll = () => {
    showAll.value = !showAll.value;
};

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
    font-weight: 800;
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

.login-btn,
.primary-btn,
.bottom-cta-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 999px;
    font-weight: 800;
    transition: 0.2s ease;
}

.login-btn {
    padding: 0.8rem 1.15rem;
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: #fff;
    box-shadow: 0 12px 20px rgba(249, 115, 22, 0.18);
}

.login-btn:hover,
.primary-btn:hover,
.bottom-cta-btn:hover {
    transform: translateY(-1px);
}

.content-wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 2rem 1.25rem 6rem;
}

.hero-card {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.9fr);
    gap: 1.25rem;
    padding: 1.75rem;
    border-radius: 30px;
    background:
        radial-gradient(circle at top right, rgba(253, 186, 116, 0.55), transparent 34%),
        linear-gradient(135deg, #fff7ed 0%, #fffbeb 52%, #f0fdfa 100%);
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
    font-size: 0.82rem;
    font-weight: 700;
}

.hero-copy p {
    max-width: 42rem;
    color: #6b7280;
    line-height: 1.75;
}

.hero-actions {
    margin-top: 1.1rem;
}

.primary-btn {
    padding: 0.9rem 1.25rem;
    background: #fff;
    color: #c2410c;
    border: 1px solid rgba(251, 146, 60, 0.22);
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

.soft-orange {
    background: #ffedd5;
}

.soft-mint {
    background: #ccfbf1;
    color: #0f766e;
}

.stat-value {
    color: #1f2937;
}

.stat-label {
    color: #6b7280;
}

.section-head {
    margin: 1.5rem 0 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-head p {
    margin-top: 0.3rem;
    color: #9ca3af;
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

.bottom-cta {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.95);
    border-top: 1px solid rgba(251, 146, 60, 0.16);
    backdrop-filter: blur(10px);
}

.bottom-cta span {
    color: #6b7280;
}

.bottom-cta-btn {
    padding: 0.85rem 1.2rem;
    background: linear-gradient(135deg, #34d399 0%, #22c55e 100%);
    color: #fff;
    box-shadow: 0 14px 24px rgba(34, 197, 94, 0.2);
}

@media (max-width: 900px) {
    .hero-card {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .topbar,
    .bottom-cta {
        padding: 0.9rem 1rem;
    }

    .content-wrap {
        padding: 1.25rem 1rem 6.5rem;
    }

    .hero-card {
        padding: 1.2rem;
        border-radius: 24px;
    }

    .bottom-cta {
        flex-direction: column;
        align-items: stretch;
    }

    .bottom-cta-btn {
        width: 100%;
    }
}

.show-all-btn {
    padding: 0.6rem 0.9rem;
    border: 1px solid #fb923c;
    border-radius: 999px;
    background: #fff7ed;
    color: #c2410c;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
}

.show-all-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(251, 146, 60, 0.18);
}
</style>
