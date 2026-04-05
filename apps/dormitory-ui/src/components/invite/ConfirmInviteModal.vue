<script setup lang="ts">
const props = defineProps({
    buildingName: String,
    roomNumber: [String, Number],
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>ยืนยันการสร้างรหัสเชิญ</h2>
            </div>

            <div class="modal-body">
                <p class="message">โปรดตรวจสอบข้อมูลก่อนสร้างรหัสเชิญ</p>

                <div class="summary-box">
                    <div class="summary-row">
                        <span class="summary-label">อาคาร</span>
                        <span class="summary-value">{{ props.buildingName || "-" }}</span>
                    </div>

                    <div class="summary-row">
                        <span class="summary-label">ห้อง</span>
                        <span class="summary-value">ห้อง {{ props.roomNumber || "-" }}</span>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="emit('cancel')">กลับไปแก้ไข</button>
                <button class="btn-submit" @click="emit('confirm')">ยืนยันสร้างรหัส</button>
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
    z-index: 10000;
}

.modal {
    width: 420px;
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

.summary-box {
    margin-top: 14px;
    padding: 14px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
}

.summary-row + .summary-row {
    margin-top: 10px;
}

.summary-label {
    color: #6b7280;
}

.summary-value {
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
.btn-submit {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
}

.btn-cancel {
    background: #e5e7eb;
    color: #1f2937;
}

.btn-submit {
    background: #1e2b4a;
    color: white;
}
</style>
