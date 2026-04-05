```vue
<template>
    <div class="max-w-5xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-semibold">การตั้งค่า LINE Official Account</h1>
                <p class="text-gray-500 text-sm mt-1">
                    เชื่อมต่อระบบประกาศกับ LINE OA เพื่อส่งการแจ้งเตือนถึงผู้พักอาศัย
                </p>
            </div>
        </div>

        <!-- 1. ยังไม่มี config -->
        <div v-if="!config && !isEditing" class="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p class="text-gray-400 text-sm mb-4">ยังไม่ได้เชื่อมต่อ LINE OA</p>
            <button
                @click="isEditing = true"
                class="text-sm px-4 py-2 bg-[#06C755] text-white rounded-lg font-medium hover:bg-green-600"
            >
                + เพิ่มการเชื่อมต่อ
            </button>
        </div>

        <!-- 2. มี config และไม่ได้ edit → view mode -->
        <div v-else-if="config && !isEditing" class="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center p-5 border-b border-gray-100">
                <div>
                    <p class="font-medium text-gray-800">{{ config.lineOaId }}</p>
                    <span class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">เชื่อมต่อแล้ว</span>
                </div>
                <button
                    @click="startEdit"
                    class="text-sm px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                    แก้ไข
                </button>
            </div>

            <div class="grid grid-cols-2 divide-x divide-gray-100">
                <div class="p-5 space-y-4">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">LINE OA ID</p>
                        <p class="text-sm text-gray-800">{{ config.lineOaId }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Channel Secret</p>
                        <p class="text-sm text-gray-400 tracking-widest">••••••••••••••••</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Add Friend URL</p>
                        <p class="text-sm text-blue-600">{{ config.addFriendUrl || "-" }}</p>
                    </div>
                </div>
                <div class="p-5 space-y-4">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Channel ID</p>
                        <p class="text-sm text-gray-800">{{ config.channelId }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Access Token</p>
                        <p class="text-sm text-gray-400 tracking-widest">••••••••••••••••••••</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">LIFF ID</p>
                        <p class="text-sm text-gray-800">{{ config.liffId || "-" }}</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 p-5 border-t border-gray-100">
                <span
                    :class="config.notificationEnabled ? 'bg-green-500' : 'bg-gray-300'"
                    class="w-8 h-4 rounded-full relative block transition-colors"
                >
                    <span
                        :class="config.notificationEnabled ? 'right-0.5' : 'left-0.5'"
                        class="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all"
                    />
                </span>
                <span class="text-sm text-gray-700">เปิดใช้งาน LINE Notification</span>
            </div>
        </div>

        <!-- 3. edit mode (ทั้ง POST และ PATCH) -->
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center p-5 border-b border-gray-100">
                <p class="font-medium text-gray-800">{{ config ? "แก้ไขการตั้งค่า LINE OA" : "เพิ่ม LINE OA" }}</p>
                <div class="flex gap-2">
                    <button
                        v-if="config"
                        @click="cancelEdit"
                        class="text-sm px-4 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        @click="saveConfig"
                        :disabled="loading"
                        class="text-sm px-4 py-1.5 bg-[#06C755] text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                    >
                        {{ loading ? "กำลังบันทึก..." : "บันทึก" }}
                    </button>
                </div>
            </div>

            <div class="p-5">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-4">ข้อมูลทั่วไป</p>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="label">LINE OA ID <span class="req">*</span></label>
                        <input v-model="form.lineOaId" class="input" placeholder="@yourOA" />
                    </div>
                    <div>
                        <label class="label">Channel ID <span class="req">*</span></label>
                        <input v-model="form.channelId" class="input" placeholder="Channel ID" />
                    </div>
                    <div>
                        <label class="label">Add Friend URL</label>
                        <input v-model="form.addFriendUrl" class="input" placeholder="https://line.me/R/ti/p/@xxxx" />
                    </div>
                    <div>
                        <label class="label">LIFF ID (optional)</label>
                        <input v-model="form.liffId" class="input" placeholder="LIFF ID" />
                    </div>
                </div>
            </div>

            <div class="p-5 border-t border-gray-100">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Credentials</p>
                <p v-if="config" class="text-xs text-gray-400 mb-4">เว้นว่างถ้าไม่ต้องการเปลี่ยน</p>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="label">Channel Secret <span v-if="!config" class="req">*</span></label>
                        <input
                            v-model="form.channelSecret"
                            class="input"
                            type="password"
                            :placeholder="config ? '••••••••••••••••' : 'Channel Secret'"
                        />
                    </div>
                    <div>
                        <label class="label">Access Token <span v-if="!config" class="req">*</span></label>
                        <input
                            v-model="form.channelAccessToken"
                            class="input"
                            type="password"
                            :placeholder="config ? '••••••••••••••••' : 'Channel Access Token'"
                        />
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 p-5 border-t border-gray-100">
                <input type="checkbox" v-model="form.notificationEnabled" class="w-4 h-4" />
                <span class="text-sm text-gray-700">เปิดใช้งาน LINE Notification</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getLineConfig, createLineConfig, updateLineConfig } from "../../../api/lineConfig.api";
import { getMe } from "../../../api/authApi";

const dormitoryId = ref<number | null>(null);

const config = ref<{
    lineOaId: string;
    channelId: string;
    addFriendUrl: string;
    liffId: string;
    notificationEnabled: boolean;
} | null>(null);

const form = ref({
    lineOaId: "",
    channelId: "",
    channelSecret: "",
    channelAccessToken: "",
    addFriendUrl: "",
    liffId: "",
    notificationEnabled: true,
});

const isEditing = ref(false);
const loading = ref(false);

const startEdit = () => {
    form.value = {
        lineOaId: config.value?.lineOaId ?? "",
        channelId: config.value?.channelId ?? "",
        channelSecret: "",
        channelAccessToken: "",
        addFriendUrl: config.value?.addFriendUrl ?? "",
        liffId: config.value?.liffId ?? "",
        notificationEnabled: config.value?.notificationEnabled ?? true,
    };
    isEditing.value = true;
};

const cancelEdit = () => {
    isEditing.value = false;
};

const saveConfig = async () => {
    try {
        loading.value = true;

        const payload: Record<string, any> = {
            dormitoryId: dormitoryId.value,
            lineOaId: form.value.lineOaId,
            channelId: form.value.channelId,
            addFriendUrl: form.value.addFriendUrl,
            liffId: form.value.liffId,
            notificationEnabled: form.value.notificationEnabled,
        };

        if (form.value.channelSecret) {
            payload.channelSecret = form.value.channelSecret;
        }
        if (form.value.channelAccessToken) {
            payload.channelAccessToken = form.value.channelAccessToken;
        }

        if (config.value) {
            await updateLineConfig(payload);
        } else {
            if (!form.value.channelSecret || !form.value.channelAccessToken) {
                alert("กรุณากรอก Channel Secret และ Access Token");
                return;
            }
            await createLineConfig(payload);
        }

        await loadConfig();
        isEditing.value = false;
        alert("บันทึกสำเร็จ");
    } catch (err) {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
        loading.value = false;
    }
};

const loadConfig = async () => {
    try {
        const res = await getLineConfig(dormitoryId.value!);
        if (res.data && res.data.line_oa_id) {
            config.value = {
                lineOaId: res.data.line_oa_id,
                channelId: res.data.channel_id,
                addFriendUrl: res.data.add_friend_url,
                liffId: res.data.liff_id,
                notificationEnabled: Boolean(res.data.notification_enabled),
            };
        } else {
            config.value = null;
        }
    } catch {
        config.value = null;
    }
};

onMounted(async () => {
    const me = await getMe();
    dormitoryId.value = me.data.dormitory_id;
    await loadConfig();
});
</script>

<style scoped>
.label {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    color: #374151;
}
.input {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
}
.input:focus {
    outline: none;
    border-color: #06c755;
}
.req {
    color: #ef4444;
}
</style>
```
