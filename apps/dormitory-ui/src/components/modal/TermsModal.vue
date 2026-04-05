<template>
    <div class="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div class="w-full max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 flex items-center gap-3">
                <div class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                    <HomeIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                    <p class="text-white font-semibold text-sm leading-none">ระบบประกาศข่าวหอพัก</p>
                    <p class="text-orange-100 text-xs mt-0.5">Dormitory Announcement System</p>
                </div>
            </div>

            <div class="px-6 pt-5 pb-6">
                <!-- Tab -->
                <div class="flex gap-0 rounded-xl overflow-hidden border border-orange-300 mb-5">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        @click="activeTab = tab.key"
                        :class="[
                            'flex-1 py-2.5 text-xs font-medium transition-all duration-150',
                            activeTab === tab.key
                                ? 'bg-orange-500 text-white'
                                : 'bg-white !text-orange-500 hover:bg-orange-50',
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <!-- Document card -->
                <div class="border border-orange-100 rounded-xl overflow-hidden mb-4">
                    <div class="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                        <span class="bg-orange-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {{ activeTab === "tos" ? "ToS" : "PP" }}
                        </span>
                        <span class="text-orange-800 text-sm font-medium">{{ activeTabData.title }}</span>
                    </div>

                    <div class="max-h-72 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                        <div v-for="(section, idx) in activeTabData.sections" :key="idx">
                            <div class="flex items-center gap-2 mb-1">
                                <span
                                    class="w-5 h-5 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-500 text-xs font-medium flex-shrink-0"
                                    >{{ idx + 1 }}</span
                                >
                                <span class="text-orange-600 text-xs font-semibold">{{ section.title }}</span>
                            </div>
                            <ul class="pl-7 space-y-1">
                                <li
                                    v-for="(item, i) in section.items"
                                    :key="i"
                                    class="flex items-start gap-2 text-gray-500 text-xs leading-relaxed"
                                >
                                    <span class="w-1.5 h-1.5 rounded-full bg-orange-200 flex-shrink-0 mt-1.5" />
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <p class="text-center text-gray-300 text-xs pt-1">เลื่อนดูเพื่ออ่านครบทุกข้อ</p>
                    </div>
                </div>

                <!-- Success state -->
                <Transition name="fade">
                    <div v-if="accepted" class="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                        <div class="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckIcon class="w-6 h-6 text-white" />
                        </div>
                        <p class="text-green-800 font-medium text-sm">ยอมรับข้อตกลงเรียบร้อยแล้ว</p>
                        <p class="text-green-600 text-xs mt-1">กำลังพาคุณเข้าสู่ระบบ...</p>
                    </div>
                </Transition>

                <!-- Checkbox + Buttons -->
                <template v-if="!accepted">
                    <div class="space-y-2 mb-4">
                        <label
                            class="flex items-start gap-3 bg-orange-50 border rounded-xl px-4 py-3 cursor-pointer select-none transition-colors"
                            :class="agreedTos ? 'border-orange-400' : 'border-orange-200'"
                        >
                            <input
                                type="checkbox"
                                v-model="agreedTos"
                                class="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer flex-shrink-0"
                            />
                            <span class="text-gray-500 text-xs leading-relaxed">
                                ข้าพเจ้าได้อ่านและยอมรับ
                                <span
                                    class="font-semibold cursor-pointer hover:underline"
                                    :class="agreedTos ? 'text-orange-600' : 'text-orange-400'"
                                    @click.prevent="activeTab = 'tos'"
                                    >ข้อตกลงการใช้งาน</span
                                >
                            </span>
                        </label>

                        <label
                            class="flex items-start gap-3 bg-orange-50 border rounded-xl px-4 py-3 cursor-pointer select-none transition-colors"
                            :class="agreedPp ? 'border-orange-400' : 'border-orange-200'"
                        >
                            <input
                                type="checkbox"
                                v-model="agreedPp"
                                class="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer flex-shrink-0"
                            />
                            <span class="text-gray-500 text-xs leading-relaxed">
                                ข้าพเจ้าได้อ่านและยอมรับ
                                <span
                                    class="font-semibold cursor-pointer hover:underline"
                                    :class="agreedPp ? 'text-orange-600' : 'text-orange-400'"
                                    @click.prevent="activeTab = 'pp'"
                                    >นโยบายความเป็นส่วนตัว</span
                                >
                            </span>
                        </label>

                        <p class="text-xs text-gray-400 text-right">
                            ยอมรับแล้ว {{ [agreedTos, agreedPp].filter(Boolean).length }} / 2 รายการ
                        </p>
                    </div>

                    <div class="flex gap-2">
                        <button
                            @click="handleDecline"
                            class="px-5 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            ปฏิเสธ
                        </button>
                        <button
                            @click="handleAccept"
                            :disabled="!canAccept"
                            :class="[
                                'flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-150',
                                canAccept
                                    ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
                                    : 'bg-orange-200 text-orange-300 cursor-not-allowed',
                            ]"
                        >
                            ยอมรับและเข้าใช้งาน →
                        </button>
                    </div>
                </template>
            </div>
        </div>

        <Transition name="fade">
            <div
                v-if="showDeclineModal"
                class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                @click.self="showDeclineModal = false"
            >
                <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                        <XMarkIcon class="w-5 h-5 text-red-500" />
                    </div>
                    <p class="text-gray-800 font-semibold text-sm mb-1">ไม่สามารถเข้าใช้งานได้</p>
                    <p class="text-gray-400 text-xs leading-relaxed mb-4">
                        หากไม่ยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว จะไม่สามารถเข้าใช้งานระบบได้
                    </p>
                    <button
                        @click="showDeclineModal = false"
                        class="w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        กลับไปอ่านข้อตกลง
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { HomeIcon, CheckIcon, XMarkIcon } from "@heroicons/vue/24/solid";

interface Section {
    title: string;
    items: string[];
}

interface TabData {
    title: string;
    sections: Section[];
}

type TabKey = "tos" | "pp";

interface Tab {
    key: TabKey;
    label: string;
}

export default defineComponent({
    name: "TermsModal",

    components: { HomeIcon, CheckIcon, XMarkIcon },

    emits: ["accepted", "declined"],

    setup(_, { emit }) {
        const activeTab = ref<TabKey>("tos");
        const agreedTos = ref<boolean>(false);
        const agreedPp = ref<boolean>(false);
        const canAccept = computed<boolean>(() => agreedTos.value && agreedPp.value);
        const accepted = ref<boolean>(false);
        const showDeclineModal = ref<boolean>(false);

        const tabs: Tab[] = [
            { key: "tos", label: "ข้อตกลงการใช้งาน" },
            { key: "pp", label: "นโยบายความเป็นส่วนตัว" },
        ];

        const tosData: TabData = {
            title: "Terms of Service — ข้อตกลงการใช้งานระบบ",
            sections: [
                {
                    title: "การใช้งานระบบ",
                    items: [
                        "ระบบนี้จัดทำขึ้นเพื่อสื่อสารข่าวสารระหว่างผู้ดูแลหอพักและผู้พักอาศัย",
                        "ผู้ใช้งานต้องใช้ข้อมูลที่ถูกต้องในการสมัครสมาชิก",
                        "ห้ามนำระบบไปใช้ในทางที่ผิดกฎหมาย หรือสร้างความเสียหายต่อผู้อื่น",
                    ],
                },
                {
                    title: "บัญชีผู้ใช้งาน",
                    items: [
                        "ผู้ใช้งานมีหน้าที่เก็บรักษาข้อมูลบัญชีของตนเอง เช่น รหัสผ่าน",
                        "หากพบการใช้งานที่ผิดปกติ กรุณาแจ้งผู้ดูแลระบบทันที",
                        "ผู้ดูแลระบบมีสิทธิ์ระงับบัญชีหากพบการใช้งานที่ไม่เหมาะสม",
                    ],
                },
                {
                    title: "การรับข่าวสารและการแจ้งเตือน",
                    items: [
                        "ระบบอาจมีการส่งประกาศผ่านเว็บไซต์และ LINE Official Account",
                        "ผู้ใช้งานยินยอมรับการแจ้งเตือนที่เกี่ยวข้องกับหอพัก",
                    ],
                },
                {
                    title: "เนื้อหาในระบบ",
                    items: ["ประกาศทั้งหมดจัดทำโดยผู้ดูแลหอพัก", "ระบบไม่รับผิดชอบต่อความเสียหายจากการตีความข้อมูล"],
                },
                {
                    title: "การเปลี่ยนแปลงข้อกำหนด",
                    items: [
                        "ระบบสามารถปรับปรุงข้อกำหนดได้ตามความเหมาะสม",
                        "การใช้งานต่อถือว่ายอมรับข้อกำหนดที่อัปเดตแล้ว",
                    ],
                },
                {
                    title: "การสิ้นสุดการใช้งาน",
                    items: ["ผู้ดูแลระบบสามารถระงับหรือยกเลิกการใช้งานได้ตามความเหมาะสม"],
                },
            ],
        };

        const ppData: TabData = {
            title: "Privacy Policy — นโยบายความเป็นส่วนตัว",
            sections: [
                {
                    title: "ข้อมูลที่เก็บรวบรวม",
                    items: ["ชื่อผู้ใช้งาน, อีเมล, ข้อมูลห้องพัก (ถ้ามี)", "ข้อมูลการใช้งานระบบ (log)"],
                },
                {
                    title: "วัตถุประสงค์การใช้ข้อมูล",
                    items: [
                        "การยืนยันตัวตนในการเข้าใช้งานระบบ",
                        "การส่งประกาศข่าวสาร",
                        "การปรับปรุงประสิทธิภาพของระบบ",
                    ],
                },
                {
                    title: "การเปิดเผยข้อมูล",
                    items: ["ระบบจะไม่เปิดเผยข้อมูลส่วนบุคคลแก่บุคคลภายนอก", "ยกเว้นในกรณีที่จำเป็นตามกฎหมาย"],
                },
                {
                    title: "การจัดเก็บข้อมูล",
                    items: [
                        "ข้อมูลจะถูกจัดเก็บในฐานข้อมูลที่มีความปลอดภัย",
                        "จำกัดสิทธิ์การเข้าถึงเฉพาะผู้ที่เกี่ยวข้อง",
                    ],
                },
                {
                    title: "การใช้ LINE Official Account",
                    items: ["ระบบอาจใช้ LINE OA เพื่อส่งการแจ้งเตือน", "การเชื่อมต่อ LINE เป็นความสมัครใจของผู้ใช้งาน"],
                },
                {
                    title: "สิทธิของผู้ใช้งาน",
                    items: ["ขอแก้ไขข้อมูลของตนเอง", "ขอให้ลบข้อมูล (ตามความเหมาะสมของระบบ)"],
                },
                {
                    title: "การเปลี่ยนแปลงนโยบาย",
                    items: [
                        "ระบบสามารถปรับปรุงนโยบายนี้ได้ตามความเหมาะสม",
                        "การใช้งานต่อถือว่ายอมรับนโยบายที่อัปเดตแล้ว",
                    ],
                },
            ],
        };

        const activeTabData = computed<TabData>(() => (activeTab.value === "tos" ? tosData : ppData));

        function handleAccept(): void {
            if (!canAccept.value) return;
            accepted.value = true;
            emit("accepted");
        }

        function handleDecline(): void {
            showDeclineModal.value = true;
            emit("declined");
        }

        return {
            tabs,
            activeTab,
            activeTabData,
            agreedTos,
            agreedPp,
            canAccept,
            accepted,
            showDeclineModal,
            handleAccept,
            handleDecline,
        };
    },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #fdba74 transparent;
}
.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #fdba74;
    border-radius: 99px;
}
</style>
