<script setup lang="ts">
const props = defineProps({
    announcement: Object,
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>ยืนยันการลบประกาศ</h2>
            </div>

            <div class="modal-body">
                <p class="message">
                    คุณต้องการลบประกาศนี้ใช่หรือไม่
                </p>

                <div class="preview-box">
                    <div class="preview-title">
                        {{ props.announcement?.title || "ไม่ได้ระบุหัวข้อ" }}
                    </div>

                    <div class="preview-content">
                        {{ props.announcement?.content || "ไม่มีรายละเอียด" }}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="emit('cancel')">ยกเลิก</button>
                <button class="btn-delete" @click="emit('confirm')">ลบประกาศ</button>
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
    width: 440px;
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.modal-header h2 {
    font-size: 22px;
    font-weight: 700;
    color: #1f2937;
}

.modal-body {
    margin-top: 14px;
}

.message {
    color: #4b5563;
}

.preview-box {
    margin-top: 14px;
    padding: 14px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
}

.preview-title {
    font-weight: 700;
    color: #111827;
}

.preview-content {
    margin-top: 8px;
    color: #6b7280;
    overflow-wrap: anywhere;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

.btn-cancel,
.btn-delete {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
}

.btn-cancel {
    background: #e5e7eb;
    color: #1f2937;
}

.btn-delete {
    background: #dc2626;
    color: white;
}
</style>
