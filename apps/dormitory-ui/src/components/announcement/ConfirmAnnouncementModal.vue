<script setup lang="ts">
import { categoryLabelMap } from "../../helper/categoryLabel";
import { targetTypeLabelMap } from "../../helper/targetLabel";
const props = defineProps({
    formData: Object,
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>ยืนยันการสร้างประกาศ</h2>
            </div>

            <div class="modal-body">
                <p><b>หัวข้อ:</b> {{ formData?.title }}</p>

                <div class="preview-block">
                    <b>รายละเอียด:</b>
                    <div class="preview-text">
                        {{ formData?.content }}
                    </div>
                </div>

                <p><b>หมวดหมู่:</b> {{ categoryLabelMap[formData?.categoryName] || formData?.categoryName }}</p>

                <p>
                    <b>กลุ่มเป้าหมาย:</b>
                    {{ targetTypeLabelMap[formData?.targetType] }}
                </p>

                <p>
                    <b>แจ้งเตือน LINE:</b>
                    {{ formData?.isLineNotificationEnabled ? "ส่ง" : "ไม่ส่ง" }}
                </p>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="$emit('cancel')">กลับไปแก้ไข</button>

                <button class="btn-submit" :disabled="loading" @click="$emit('confirm')">
                    {{ loading ? "กำลังสร้าง..." : "ยืนยันสร้างประกาศ" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal {
    width: 480px;
    max-width: calc(100vw - 32px);
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    flex-shrink: 0;
}

.modal-body {
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #eee;
    flex-shrink: 0;
}

.btn-submit {
    background: #243256;
    color: white;
    padding: 10px 24px;
    border-radius: 10px;
}

.btn-cancel {
    background: #eee;
    padding: 10px 24px;
    border-radius: 10px;
}

.preview-text {
    margin-top: 4px;
    padding: 10px;
    background: #f8fafc;
    border-radius: 8px;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-line;
}
</style>
