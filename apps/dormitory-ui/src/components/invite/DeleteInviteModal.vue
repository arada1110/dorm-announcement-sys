<script setup lang="ts">
const props = defineProps<{
    invite?: {
        code?: string;
        room_number?: string | number | null;
    } | null;
}>();

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay" @click.self="emit('cancel')">
        <div class="modal">
            <div class="modal-header">
                <h2>ยืนยันการลบรหัสเชิญ</h2>
            </div>

            <div class="modal-body">
                <p class="message">คุณต้องการลบรหัสเชิญนี้ใช่หรือไม่</p>

                <div class="preview-box">
                    <div class="preview-row">
                        <span class="preview-label">รหัสเชิญ</span>
                        <span class="preview-value">
                            {{ props.invite?.code || "-" }}
                        </span>
                    </div>

                    <div class="preview-row">
                        <span class="preview-label">ห้อง</span>
                        <span class="preview-value"> ห้อง {{ props.invite?.room_number || "-" }} </span>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="emit('cancel')">ยกเลิก</button>

                <button class="btn-delete" @click="emit('confirm')">ลบรหัสเชิญ</button>
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
    width: min(440px, calc(100vw - 32px));
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

.preview-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.preview-row + .preview-row {
    margin-top: 10px;
}

.preview-label {
    color: #6b7280;
}

.preview-value {
    font-weight: 600;
    color: #111827;
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

@media (max-width: 640px) {
    .modal {
        padding: 20px;
    }

    .modal-footer {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-delete {
        width: 100%;
    }
}
</style>
