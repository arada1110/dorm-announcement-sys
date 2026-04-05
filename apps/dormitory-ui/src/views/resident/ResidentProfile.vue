<template>
    <AppContainer>
        <div class="profile-page">
            <section class="hero-card">
                <div class="hero-copy">
                    <span class="hero-kicker text-xs font-bold">
                        <ShieldCheck :size="14" />
                        ข้อมูลผู้พักอาศัย
                    </span>

                    <h1 class="text-2xl font-extrabold">โปรไฟล์ของฉัน</h1>

                    <p class="text-sm">
                        ตรวจสอบข้อมูลส่วนตัว ห้องพัก และช่องทางรับข่าวสารของคุณ
                        ได้จากหน้านี้ในบรรยากาศที่อ่านง่ายและเป็นชุดเดียวกับหน้าข่าวสาร
                    </p>
                </div>

                <div class="hero-user-card">
                    <div class="avatar text-xl font-extrabold">{{ firstNameInitial }}</div>

                    <div>
                        <div class="hero-name text-base font-extrabold">{{ fullName }}</div>
                        <div class="hero-role text-xs">ผู้พักอาศัย</div>
                    </div>
                </div>
            </section>

            <div class="profile-grid">
                <section class="panel-card">
                    <div class="section-head">
                        <div class="section-icon soft-orange">
                            <UserRound :size="18" />
                        </div>

                        <div>
                            <h2 class="text-base font-extrabold">ข้อมูลส่วนตัว</h2>
                            <p class="text-xs">ข้อมูลพื้นฐานสำหรับบัญชีผู้พักอาศัยของคุณ</p>
                        </div>
                    </div>

                    <div class="info-list">
                        <div class="info-box">
                            <div class="info-icon soft-cream">
                                <Mail :size="16" />
                            </div>

                            <div>
                                <div class="info-label text-xs font-semibold">อีเมล</div>
                                <div class="info-value text-sm font-bold">{{ user?.email || "-" }}</div>
                            </div>
                        </div>

                        <div class="info-box">
                            <div class="info-icon soft-yellow">
                                <CalendarDays :size="16" />
                            </div>

                            <div>
                                <div class="info-label text-xs font-semibold">วันที่เริ่มใช้งาน</div>
                                <div class="info-value text-sm font-bold">
                                    {{ formatDate(user?.start_date || user?.created_at) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="panel-card">
                    <div class="section-head">
                        <div class="section-icon soft-mint">
                            <House :size="18" />
                        </div>

                        <div>
                            <h2 class="text-base font-extrabold">ข้อมูลห้องพัก</h2>
                            <p class="text-xs">รายละเอียดห้องพักที่ผูกกับบัญชีของคุณ</p>
                        </div>
                    </div>

                    <div class="room-grid">
                        <div class="room-box">
                            <div class="room-value text-2xl font-extrabold">{{ roomNumber }}</div>
                            <div class="room-label text-xs font-semibold">หมายเลขห้อง</div>
                        </div>

                        <div class="room-box alt">
                            <div class="room-value text-2xl font-extrabold">{{ floorLabel }}</div>
                            <div class="room-label text-xs font-semibold">ชั้น</div>
                        </div>
                    </div>

                    <div v-if="user?.building_name" class="building-chip text-xs font-bold">
                        {{ user.building_name }}
                    </div>
                </section>
            </div>

            <section class="line-card">
                <div class="line-copy">
                    <div class="section-icon soft-line">
                        <Bell :size="18" />
                    </div>

                    <div>
                        <h3 class="text-base font-extrabold">รับแจ้งเตือนข่าวสารผ่าน LINE</h3>
                        <p class="text-xs">
                            เพิ่ม LINE Official Account ของหอพักเพื่อรับข่าวประกาศใหม่
                            และไม่พลาดการแจ้งเตือนที่เกี่ยวข้องกับห้องของคุณ
                        </p>
                    </div>
                </div>

                <div v-if="isLineLinked" class="line-linked-badge">
                    <CheckCircle :size="16" />
                    <span class="text-sm font-bold">เชื่อมต่อ LINE แล้ว</span>
                </div>

                <div v-else class="line-steps">
                    <div class="step" :class="{ done: addedFriend }">
                        <div class="step-number">1</div>
                        <div class="step-body">
                            <p class="step-label">เพิ่มเพื่อน LINE OA ของหอพัก</p>

                            <a
                                v-if="lineConfig?.addFriendUrl"
                                :href="lineConfig.addFriendUrl"
                                target="_blank"
                                @click="addedFriend = true"
                                class="line-btn text-sm font-extrabold"
                            >
                                เพิ่มเพื่อน LINE OA
                            </a>
                        </div>
                    </div>

                    <div class="step" :class="{ disabled: !addedFriend }">
                        <div class="step-number">2</div>
                        <div class="step-body">
                            <p class="step-label">รับรหัสเชื่อมต่อแล้วพิมพ์ใน LINE chat</p>
                            <button
                                @click="requestLinkingToken"
                                :disabled="!addedFriend || loadingToken"
                                class="otp-btn text-sm font-bold"
                            >
                                {{ loadingToken ? "กำลังสร้างรหัส..." : "รับรหัสเชื่อมต่อ" }}
                            </button>

                            <div v-if="linkingToken" class="otp-box">
                                <p class="text-xs text-gray-500 mb-1">พิมพ์รหัสนี้ใน LINE chat ของหอพัก</p>
                                <div class="otp-code">{{ linkingToken }}</div>
                                <p class="text-xs text-gray-400 mt-1">หมดอายุใน {{ countdownLabel }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Bell, CalendarDays, House, Mail, ShieldCheck, UserRound } from "lucide-vue-next";
import AppContainer from "../../components/ui/AppContainer.vue";
import { getMe } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import { ResidentUser } from "../../models/userModel";
import { getLineAccount, getLinkingToken, getPublicLineConfig } from "../../api/lineConfig.api";

const authStore = useAuthStore();
const user = ref<ResidentUser | null>(null);
const lineConfig = ref<{ addFriendUrl: string; notificationEnabled: boolean } | null>(null);

const isLineLinked = ref(false);
const linkingToken = ref<string | null>(null);
const tokenCountdown = ref(0);
const loadingToken = ref(false);
let countdownTimer: ReturnType<typeof setInterval> | null = null;
const addedFriend = ref(false);

onMounted(async () => {
    const res = await getMe();
    user.value = res.data;

    if (res.data.dormitory_id) {
        try {
            const lineRes = await getPublicLineConfig(res.data.dormitory_id);
            if (lineRes.data && lineRes.data.enabled !== false) {
                lineConfig.value = {
                    addFriendUrl: lineRes.data.addFriendUrl,
                    notificationEnabled: lineRes.data.notificationEnabled,
                };
            }
        } catch {
            lineConfig.value = null;
        }
    }

    try {
        const accountRes = await getLineAccount();
        isLineLinked.value = accountRes.data.linked;
    } catch {
        isLineLinked.value = false;
    }
});

onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer);
});

const checkLineLinked = async () => {
    try {
        const accountRes = await getLineAccount();
        if (accountRes.data.linked) {
            isLineLinked.value = true;
            linkingToken.value = null;
            clearInterval(countdownTimer!);
            countdownTimer = null;
        }
    } catch {}
};

const requestLinkingToken = async () => {
    try {
        loadingToken.value = true;
        const res = await getLinkingToken();
        linkingToken.value = res.data.token;
        tokenCountdown.value = 5 * 60;

        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(async () => {
            tokenCountdown.value--;

            if (tokenCountdown.value % 3 === 0) {
                await checkLineLinked();
            }
            if (tokenCountdown.value <= 0) {
                clearInterval(countdownTimer!);
                linkingToken.value = null;
            }
        }, 1000);
    } catch {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
        loadingToken.value = false;
    }
};

const countdownLabel = computed(() => {
    const m = Math.floor(tokenCountdown.value / 60);
    const s = tokenCountdown.value % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
});

const fullName = computed(() => {
    if (!user.value) return "ผู้พักอาศัย";
    return `${user.value.first_name ?? ""} ${user.value.last_name ?? ""}`.trim() || "ผู้พักอาศัย";
});

const firstNameInitial = computed(() => fullName.value.charAt(0).toUpperCase() || "R");

const roomNumber = computed(() => user.value?.room_number ?? authStore.roomId ?? "-");

const floorLabel = computed(() => {
    return user.value?.floor ? String(user.value.floor) : "-";
});

function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
</script>

<style scoped>
.profile-page {
    padding: 0 0 2.5rem;
}

.hero-card {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(240px, 0.85fr);
    gap: 1.25rem;
    padding: 1.75rem;
    border-radius: 28px;
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
}

.hero-copy h1 {
    margin: 1rem 0 0.65rem;
    color: #1f2937;
}

.hero-copy p {
    max-width: 40rem;
    color: #6b7280;
    line-height: 1.75;
}

.hero-user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.15rem;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(255, 237, 213, 0.9);
    align-self: center;
}

.avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: #fff;
    box-shadow: 0 14px 24px rgba(249, 115, 22, 0.22);
}

.hero-name {
    color: #1f2937;
}

.hero-role {
    margin-top: 0.2rem;
    color: #9ca3af;
}

.profile-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.2rem;
}

.panel-card,
.line-card {
    padding: 1.4rem;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(253, 186, 116, 0.24);
    box-shadow: 0 12px 28px rgba(148, 163, 184, 0.08);
}

.section-head {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    margin-bottom: 1rem;
}

.section-head h2 {
    color: #1f2937;
}

.section-head p {
    margin-top: 0.25rem;
    color: #9ca3af;
    line-height: 1.6;
}

.section-icon,
.info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 18px;
    color: #9a3412;
    flex-shrink: 0;
}

.soft-orange {
    background: #ffedd5;
}

.soft-mint {
    background: #ccfbf1;
    color: #0f766e;
}

.soft-line {
    background: #dcfce7;
    color: #15803d;
}

.soft-cream {
    background: #fff7ed;
}

.soft-yellow {
    background: #fef3c7;
}

.info-list {
    display: grid;
    gap: 0.85rem;
}

.info-box {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.95rem;
    border-radius: 18px;
    background: linear-gradient(180deg, #fffdfa 0%, #fff7ed 100%);
    border: 1px solid rgba(253, 186, 116, 0.16);
}

.info-label {
    color: #9ca3af;
}

.info-value {
    margin-top: 0.2rem;
    color: #374151;
    overflow-wrap: anywhere;
}

.room-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
}

.building-chip {
    display: inline-flex;
    align-items: center;
    margin-top: 0.95rem;
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    background: #ffedd5;
    color: #c2410c;
}

.room-box {
    padding: 1.2rem 1rem;
    border-radius: 22px;
    text-align: center;
    background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
    border: 1px solid rgba(251, 146, 60, 0.18);
}

.room-box.alt {
    background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%);
    border-color: rgba(45, 212, 191, 0.24);
}

.room-value {
    color: #f97316;
}

.room-box.alt .room-value {
    color: #0f766e;
}

.room-label {
    margin-top: 0.35rem;
    color: #9ca3af;
}

.line-card {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.line-copy {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
}

.line-copy h3 {
    color: #1f2937;
}

.line-copy p {
    margin-top: 0.3rem;
    color: #6b7280;
    line-height: 1.7;
}

.line-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 1.25rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #34d399 0%, #22c55e 100%);
    color: #fff;
    font-weight: 800;
    white-space: nowrap;
    box-shadow: 0 14px 24px rgba(34, 197, 94, 0.2);
    transition: 0.2s ease;
}

.line-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 28px rgba(34, 197, 94, 0.24);
}

.line-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
}

.otp-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
}

.otp-btn {
    padding: 0.75rem 1.25rem;
    border-radius: 999px;
    border: 2px solid #06c755;
    color: #06c755;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: 0.2s ease;
}

.otp-btn:hover {
    background: #f0fdf4;
}

.otp-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.otp-box {
    text-align: center;
    padding: 0.85rem 1.25rem;
    border-radius: 16px;
    background: #f0fdf4;
    border: 1px solid rgba(6, 199, 85, 0.2);
}

.otp-code {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.35em;
    color: #15803d;
}

.line-linked-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.1rem;
    border-radius: 999px;
    background: #dcfce7;
    color: #15803d;
    white-space: nowrap;
}

.line-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 260px;
}

.step {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
}

.step.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #06c755;
    color: white;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
}

.step.done .step-number {
    background: #d1fae5;
    color: #15803d;
}

.step-label {
    font-size: 13px;
    color: #374151;
    margin-bottom: 0.5rem;
}

.step-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (max-width: 900px) {
    .hero-card,
    .profile-grid {
        grid-template-columns: 1fr;
    }

    .line-card {
        flex-direction: column;
        align-items: stretch;
    }
}

@media (max-width: 640px) {
    .hero-card,
    .panel-card,
    .line-card {
        padding: 1.15rem;
        border-radius: 22px;
    }

    .room-grid {
        grid-template-columns: 1fr;
    }

    .hero-user-card {
        padding: 1rem;
    }

    .line-btn {
        width: 100%;
    }
}
</style>
