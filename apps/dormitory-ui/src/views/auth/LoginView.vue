<template>
    <div class="login-page">
        <div class="bg-orb bg-orb-1"></div>
        <div class="bg-orb bg-orb-2"></div>

        <div class="center-wrap">
            <div class="card">
                <!-- Left brand panel -->
                <div class="brand-panel">
                    <div class="brand-top">
                        <div class="brand-logo">
                            <House :size="20" />
                        </div>
                        <div>
                            <div class="text-lg font-extrabold tracking-tight">ข่าวสารของหอพัก</div>
                            <div class="brand-subtitle text-xs">กระดานข่าวสารภายในหอพัก</div>
                        </div>
                    </div>

                    <div class="brand-body">
                        <h2 text-3xl font-extrabold leading-tight tracking-tight>ติดตามข่าวสารของหอพักคุณ</h2>
                        <p text-sm mt-3>เข้าสู่ระบบเพื่อดูประกาศเฉพาะห้องของคุณ และรับการแจ้งเตือนผ่าน LINE ได้ทันที</p>
                    </div>

                    <div class="feature-list">
                        <div class="feature-item">
                            <div class="feature-icon-wrap"><Megaphone :size="16" /></div>
                            <div>
                                <div class="text-xs font-bold">ประกาศเฉพาะห้อง</div>
                                <div class="feature-desc text-xs">รับข่าวที่เกี่ยวข้องกับห้องคุณโดยตรง</div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon-wrap"><BellRing :size="16" /></div>
                            <div>
                                <div class="text-xs font-bold">แจ้งเตือนผ่าน LINE</div>
                                <div class="feature-desc text-xs">ไม่พลาดทุกประกาศสำคัญ</div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon-wrap"><ClipboardList :size="16" /></div>
                            <div>
                                <div class="text-xs font-bold">ข่าวสารทั่วไป</div>
                                <div class="feature-desc text-xs">ดูข่าวสาธารณะของหอพักได้ตลอดเวลา</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-panel">
                    <div class="mode-switch">
                        <button
                            @click="switchMode('login')"
                            class="mode-button text-sm font-semibold"
                            :class="{ active: mode === 'login' }"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            @click="switchMode('register')"
                            class="mode-button text-sm font-semibold"
                            :class="{ active: mode === 'register' }"
                        >
                            สมัครสมาชิก
                        </button>
                    </div>

                    <template v-if="mode === 'login'">
                        <div class="form-heading">
                            <h1 class="text-2xl font-extrabold text-stone-900 tracking-tight">ยินดีต้อนรับกลับ</h1>
                            <p class="text-xs text-slate-400 mt-1">เข้าสู่ระบบด้วยบัญชีผู้พักอาศัย</p>
                        </div>

                        <div class="field">
                            <label class="text-xs font-bold text-stone-600">อีเมล <span class="req">*</span></label>
                            <input v-model="email" type="email" class="input text-sm" placeholder="your@email.com" />
                        </div>
                        <div class="field">
                            <label class="text-xs font-bold text-stone-600">รหัสผ่าน <span class="req">*</span></label>
                            <input v-model="password" type="password" class="input text-sm" placeholder="••••••••" />
                        </div>

                        <button class="submit-button-full text-sm font-bold" @click="handleLogin" :disabled="loading">
                            {{ loading ? "กำลังดำเนินการ..." : "เข้าสู่ระบบ" }}
                        </button>

                        <p v-if="error" class="error-msg">{{ error }}</p>

                        <div class="admin-link-block">
                            <span>คุณเป็นผู้ดูแลระบบ?</span>
                            <router-link to="/admin/login" class="admin-link">เข้าสู่ระบบสำหรับผู้ดูแล →</router-link>
                        </div>
                    </template>

                    <template v-else-if="mode === 'register' && registerStep === 1">
                        <div class="form-heading">
                            <h1 class="text-2xl font-extrabold text-stone-900 tracking-tight">สมัครสมาชิกใหม่</h1>
                            <p class="text-xs text-slate-400 mt-1">ขั้นตอนที่ 1 จาก 2 — ยืนยันรหัสเชิญ</p>
                        </div>

                        <div class="step-indicator">
                            <div class="step active">
                                <div class="step-dot">1</div>
                                <span>รหัสเชิญ</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-dot">2</div>
                                <span>ข้อมูลส่วนตัว</span>
                            </div>
                        </div>

                        <div class="invite-card">
                            <div class="invite-icon">
                                <KeyRound :size="22" />
                            </div>
                            <div>
                                <div class="invite-title">รหัสเชิญ</div>
                                <div class="invite-desc">รับรหัสเชิญจากผู้ดูแลหอพักก่อนสมัคร</div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="text-xs font-bold text-stone-600">รหัสเชิญ <span class="req">*</span></label>
                            <input
                                v-model="inviteCode"
                                class="input input-invite"
                                placeholder="XXXX-XXXX-XXXX"
                                @keyup.enter="goToStep2"
                            />
                        </div>

                        <button
                            class="submit-button-full text-sm font-bold"
                            @click="goToStep2"
                            :disabled="!inviteCode.trim()"
                        >
                            ถัดไป →
                        </button>

                        <p v-if="error" class="error-msg">{{ error }}</p>
                    </template>

                    <template v-else-if="mode === 'register' && registerStep === 2">
                        <div class="form-heading">
                            <h1 class="text-2xl font-extrabold text-stone-900 tracking-tight">สมัครสมาชิกใหม่</h1>
                            <p class="text-xs text-slate-400 mt-1">ขั้นตอนที่ 2 จาก 2 — กรอกข้อมูลส่วนตัว</p>
                        </div>

                        <div class="step-indicator">
                            <div class="step done">
                                <div class="step-dot"><Check :size="12" /></div>
                                <span>รหัสเชิญ</span>
                            </div>
                            <div class="step-line filled"></div>
                            <div class="step active">
                                <div class="step-dot">2</div>
                                <span>ข้อมูลส่วนตัว</span>
                            </div>
                        </div>

                        <div class="field">
                            <label class="text-xs font-bold text-stone-600"
                                >ชื่อผู้ใช้ <span class="req">*</span></label
                            >
                            <input v-model="username" class="input text-sm" placeholder="username" />
                        </div>
                        <div class="field">
                            <label class="text-xs font-bold text-stone-600"
                                >ชื่อ-นามสกุล <span class="req">*</span></label
                            >
                            <input v-model="fullName" class="input text-sm" placeholder="ชื่อ นามสกุล" />
                        </div>
                        <div class="field">
                            <label class="text-xs font-bold text-stone-600">อีเมล <span class="req">*</span></label>
                            <input v-model="email" type="email" class="input text-sm" placeholder="your@email.com" />
                        </div>
                        <div class="field">
                            <label class="text-xs font-bold text-stone-600">รหัสผ่าน <span class="req">*</span></label>
                            <input v-model="password" type="password" class="input text-sm" placeholder="••••••••" />
                        </div>
                        <div class="field">
                            <label class="text-xs font-bold text-stone-600"
                                >ยืนยันรหัสผ่าน <span class="req">*</span></label
                            >
                            <input
                                v-model="confirmPassword"
                                type="password"
                                class="input text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div class="button-row">
                            <button class="back-button" @click="registerStep = 1" :disabled="loading">
                                ← ย้อนกลับ
                            </button>
                            <button class="submit-button flex-1" @click="handleRegister" :disabled="loading">
                                {{ loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก" }}
                            </button>
                        </div>

                        <p v-if="error" class="error-msg">{{ error }}</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { House, Megaphone, BellRing, ClipboardList, KeyRound, Check } from "lucide-vue-next";
import { login } from "../../api/authApi";
import { register } from "../../api/registerApi";
import { useAuthStore } from "../../stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const mode = ref<"login" | "register">("login");
const registerStep = ref(1);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const fullName = ref("");
const inviteCode = ref("");
const username = ref("");
const loading = ref(false);
const error = ref("");

const switchMode = (next: "login" | "register") => {
    mode.value = next;
    registerStep.value = 1;
    error.value = "";
};

const goToStep2 = () => {
    if (!inviteCode.value.trim()) {
        error.value = "กรุณากรอกรหัสเชิญ";
        return;
    }
    error.value = "";
    registerStep.value = 2;
};

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = "";

        const res = await login({
            email: email.value,
            password: password.value,
        });

        const token = res.data.access_token;
        const user = res.data.user;
        authStore.setToken(token);
        localStorage.setItem("role", user.role_name);

        const redirectTo = route.query.redirect as string;
        if (redirectTo) {
            router.push(redirectTo);
        } else {
            if (user.role_name === "ADMIN") {
                router.push("/admin/dashboard");
            }
            if (user.role_name === "RESIDENT") {
                router.push("/resident/announcements");
            }
        }
    } catch {
        error.value = "Email หรือ Password ไม่ถูกต้อง";
    } finally {
        loading.value = false;
    }
};

const handleRegister = async () => {
    if (!username.value) {
        error.value = "กรุณากรอกชื่อผู้ใช้";
        return;
    }
    if (!fullName.value) {
        error.value = "กรุณากรอกชื่อ-นามสกุล";
        return;
    }
    if (!email.value) {
        error.value = "กรุณากรอกอีเมล";
        return;
    }
    if (password.value !== confirmPassword.value) {
        error.value = "รหัสผ่านไม่ตรงกัน";
        return;
    }
    try {
        loading.value = true;
        error.value = "";
        const nameParts = fullName.value.trim().split(" ");
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ") || "-";
        await register({
            email: email.value,
            username: username.value,
            first_name,
            last_name,
            password: password.value,
            inviteCode: inviteCode.value,
        });
        alert("สมัครสมาชิกสำเร็จ");
        mode.value = "login";
        registerStep.value = 1;
    } catch {
        error.value = "สมัครสมาชิกไม่สำเร็จ";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-page {
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fffbf5;
    position: relative;
    padding: 32px 16px;
}

.bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
}
.bg-orb-1 {
    width: 500px;
    height: 500px;
    background: rgba(251, 146, 60, 0.18);
    top: -150px;
    left: -100px;
}
.bg-orb-2 {
    width: 400px;
    height: 400px;
    background: rgba(234, 179, 8, 0.12);
    bottom: -100px;
    right: 10%;
}

.center-wrap {
    width: 100%;
    max-width: 860px;
    position: relative;
    z-index: 1;
    height: 90vh;
}

.card {
    display: flex;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
        0 20px 60px rgba(194, 100, 3, 0.13),
        0 4px 16px rgba(0, 0, 0, 0.07);
}

/* ── Brand panel ── */
.brand-panel {
    width: 42%;
    flex-shrink: 0;
    background: linear-gradient(160deg, #f97316 0%, #fb923c 55%, #fbbf24 100%);
    color: white;
    padding: 44px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 32px;
    position: sticky;
    overflow: hidden;
    top: 0;
}
.brand-panel::before {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    bottom: -80px;
    right: -80px;
}
.brand-panel::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    bottom: -20px;
    right: -20px;
}

.brand-top {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}
.brand-logo {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.brand-subtitle {
    color: rgba(255, 255, 255, 0.95);
    margin-top: 2px;
}

.brand-body {
    position: relative;
}

.brand-body p {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.95);
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
}
.feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(145, 145, 145, 0.12);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 14px;
    padding: 12px 16px;
}

.feature-item .text-xs.font-bold {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.feature-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.2);
    /* background: rgba(255, 255, 255, 0.4); */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.feature-desc {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    margin-top: 1px;
}

/* ── Form panel ── */
.form-panel {
    flex: 1;
    background: #ffffff;
    padding: 36px 40px;
    padding-bottom: 48px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    max-height: 100%;
}

.mode-switch {
    background: #fff7ed;
    border-radius: 14px;
    padding: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 22px;
    border: 1px solid #fed7aa;
}
.mode-button {
    min-height: 40px;
    border-radius: 10px;
    color: #9a6a3a;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: transparent;
}
.mode-button.active {
    background: #f97316;
    color: white;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.32);
}

.form-heading {
    margin-bottom: 18px;
}
.form-heading h1 {
    color: #1c1917;
}
.form-heading p {
    color: #94a3b8;
    margin-top: 4px;
}

/* Step indicator */
.step-indicator {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 22px;
}
.step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #c7bdb7;
}
.step.active {
    color: #f97316;
}
.step.done {
    color: #10b981;
}

.step-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #f3f4f6;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
}
.step.active .step-dot {
    background: #f97316;
    color: white;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
}
.step.done .step-dot {
    background: #10b981;
    color: white;
}

.step-line {
    flex: 1;
    height: 2px;
    background: #f3f4f6;
    margin: 0 10px;
    border-radius: 2px;
}
.step-line.filled {
    background: #10b981;
}

/* Invite card highlight */
.invite-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 18px;
}
.invite-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #f97316;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.invite-title {
    font-size: 14px;
    font-weight: 700;
    color: #92400e;
}
.invite-desc {
    font-size: 12px;
    color: #b45309;
    margin-top: 2px;
    line-height: 1.5;
}

.input-invite {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 14px;
}

.req {
    color: #ef4444;
}

.input {
    width: 100%;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    padding: 11px 14px;
    background: #fafaf9;
    color: #1c1917;
    transition: all 0.2s;
}
.input::placeholder {
    color: #c7bdb7;
}
.input:focus {
    outline: none;
    border-color: #f97316;
    background: white;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.button-row {
    display: flex;
    gap: 10px;
    margin-top: 4px;
}

/* Full-width button — used for login & step 1 */
.submit-button-full {
    width: 100%;
    height: 44px;
    background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
    color: white;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);

    margin-top: 4px;
}
.submit-button-full:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}
.submit-button-full:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
}

/* Flex button — used inside .button-row (step 2) */
.submit-button {
    flex: 1;
    height: 44px;
    background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
    color: white;
    padding: 0 20px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);

    margin-top: 4px;
}
.submit-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}
.submit-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
}

.back-button {
    padding: 0 18px;
    height: 44px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    color: #78716c;
    border: 1.5px solid #e7e5e4;
    background: white;
    cursor: pointer;
    transition: all 0.2s;

    margin-top: 4px;
    white-space: nowrap;
}
.back-button:hover:not(:disabled) {
    border-color: #d6d3d1;
    background: #fafaf9;
}

.error-msg {
    margin-top: 12px;
    text-align: center;
    color: #dc2626;
    font-size: 13px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 9px;
    padding: 10px;
}

.admin-link-block {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #f5f5f4;
    font-size: 13px;
    color: #a8a29e;
}
.admin-link {
    color: #f97316;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.15s;
}
.admin-link:hover {
    color: #ea580c;
}

@media (max-width: 700px) {
    .login-page {
        height: auto;
        min-height: 100vh;
        overflow: auto;
        align-items: flex-start;
        padding: 16px;
    }

    .center-wrap {
        height: auto;
    }

    .card {
        flex-direction: column;
        height: auto;
    }

    .brand-panel {
        width: 100%;
        padding: 28px 24px;
        position: relative;
        top: auto;
    }

    .form-panel {
        padding: 24px 20px 36px;
        overflow-y: visible;
        max-height: none;
    }
}
</style>
