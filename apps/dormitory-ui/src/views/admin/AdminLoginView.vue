<template>
    <div class="admin-login-page">
        <div class="bg-noise"></div>

        <div class="center-wrap">
            <router-link to="/login" class="back-link">
                <ChevronLeft :size="15" />
                กลับหน้าเข้าสู่ระบบผู้พักอาศัย
            </router-link>

            <div class="card">
                <!-- Left brand panel -->
                <div class="brand-panel">
                    <div class="brand-top">
                        <div class="brand-logo">
                            <House :size="20" />
                        </div>
                        <div>
                            <div class="text-lg font-extrabold tracking-tight">ข่าวสารของหอพัก</div>
                            <div class="brand-subtitle text-xs">ระบบจัดการหอพัก</div>
                        </div>
                    </div>

                    <div class="brand-body">
                        <h2 class="text-3xl font-extrabold leading-tight tracking-tight">
                            จัดการหอพักของคุณ<br />อย่างง่ายดาย
                        </h2>
                        <p class="text-sm mt-3">ประกาศข่าวสาร จัดการผู้พักอาศัย และติดตามทุกอย่างในที่เดียว</p>
                    </div>

                    <div class="brand-footer">
                        <div class="stat-pill">
                            <ShieldCheck :size="14" />
                            <span>Admin Portal</span>
                        </div>
                    </div>
                </div>

                <!-- Right form panel -->
                <div class="form-panel">
                    <div class="form-heading">
                        <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">เข้าสู่ระบบเจ้าของหอ</h1>
                        <p class="text-sm text-slate-400 mt-1">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>
                    </div>

                    <div class="field">
                        <label class="label text-xs font-bold text-slate-600">อีเมล <span class="req">*</span></label>
                        <input v-model="email" type="email" class="input text-sm" placeholder="admin@dormitory.com" />
                    </div>

                    <div class="field">
                        <label class="label text-xs font-bold text-slate-600"
                            >รหัสผ่าน <span class="req">*</span></label
                        >
                        <input v-model="password" type="password" class="input text-sm" placeholder="••••••••" />
                    </div>

                    <button class="submit-button text-base font-bold" @click="handleLogin" :disabled="loading">
                        <span v-if="!loading">เข้าสู่ระบบ</span>
                        <span v-else class="loading-row">
                            <span class="spinner"></span>
                            กำลังตรวจสอบ...
                        </span>
                    </button>

                    <p v-if="error" class="error-msg">{{ error }}</p>

                    <div class="form-note">
                        <ShieldAlert :size="13" />
                        <span>สำหรับผู้ดูแลระบบที่ได้รับสิทธิ์เท่านั้น</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { House, ShieldCheck, ShieldAlert, ChevronLeft } from "lucide-vue-next";
import { login } from "../../api/authApi";
import type { IUser } from "../../models/userModel";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = "";
        const res = await login({ email: email.value, password: password.value });
        const token = res.data.access_token;
        const user: IUser = res.data.user;
        authStore.setToken(token);

        if (user.role_name === "ADMIN") {
            router.push("/admin/dashboard");
        } else {
            error.value = "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานในฐานะผู้ดูแลระบบ";
        }
    } catch {
        error.value = "Email หรือ Password ไม่ถูกต้อง";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.admin-login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef0f5;
    position: relative;
    padding: 32px 16px;
}

.bg-noise {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
}

.center-wrap {
    width: 100%;
    max-width: 860px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    z-index: 1;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
}
.back-link:hover {
    color: #3b5bdb;
}

/* Card: two columns */
.card {
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
        0 20px 60px rgba(30, 41, 90, 0.14),
        0 4px 16px rgba(30, 41, 90, 0.08);
    min-height: 480px;
}

/* ─── Brand panel (left) ─── */
.brand-panel {
    width: 42%;
    flex-shrink: 0;
    background: linear-gradient(160deg, #2d3a6b 0%, #3d4f8f 60%, #4a5fa8 100%);
    color: white;
    padding: 44px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

/* subtle circle decoration */
.brand-panel::before {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.07);
    bottom: -80px;
    right: -80px;
}
.brand-panel::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    bottom: -20px;
    right: -20px;
}

.brand-top {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-logo {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.brand-subtitle {
    color: rgba(255, 255, 255, 0.65);
    margin-top: 2px;
}

.brand-body {
    position: relative;
}

.brand-body p {
    margin-top: 14px;
    color: rgba(255, 255, 255, 0.72);
}

.brand-footer {
    position: relative;
}

.stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    padding: 7px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.3px;
    color: rgba(255, 255, 255, 0.9);
}

/* ─── Form panel (right) ─── */
.form-panel {
    flex: 1;
    background: #ffffff;
    padding: 44px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
}

.form-heading {
    margin-bottom: 28px;
}

.form-heading h1 {
    color: #1e293b;
    letter-spacing: -0.3px;
}
.form-heading p {
    color: #94a3b8;
    margin-top: 6px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 18px;
}

.label {
    color: #475569;
}

.input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    background: #f8fafc;
    color: #1e293b;
    transition: all 0.2s;
}
.input::placeholder {
    color: #cbd5e1;
}
.input:focus {
    outline: none;
    border-color: #3d4f8f;
    background: white;
    box-shadow: 0 0 0 3px rgba(61, 79, 143, 0.1);
}

.submit-button {
    width: 100%;
    background: linear-gradient(135deg, #2d3a6b 0%, #3d4f8f 100%);
    color: white;
    padding: 13px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(45, 58, 107, 0.3);
    margin-top: 4px;
}
.submit-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(45, 58, 107, 0.38);
}
.submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.loading-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-msg {
    margin-top: 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    font-size: 13px;
    border-radius: 9px;
    padding: 10px 14px;
    text-align: center;
}

.form-note {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid #f1f5f9;
    font-size: 12px;
    color: #94a3b8;
}

/* Responsive */
@media (max-width: 680px) {
    .card {
        flex-direction: column;
    }
    .brand-panel {
        width: 100%;
        padding: 32px 28px;
        min-height: 200px;
    }
    .form-panel {
        padding: 32px 28px;
    }
}

.req {
    color: #ef4444;
}
</style>
