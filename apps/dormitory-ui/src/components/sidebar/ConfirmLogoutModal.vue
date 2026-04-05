<script setup lang="ts">
const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay" @click.self="emit('cancel')">
        <div class="modal">
            <div class="modal-header">
                <h2>ยืนยันการออกจากระบบ</h2>
            </div>

            <div class="modal-body">
                <p class="message">
                    คุณต้องการออกจากระบบใช่หรือไม่
                </p>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="emit('cancel')">
                    ยกเลิก
                </button>

                <button class="btn-confirm" @click="emit('confirm')">
                    ออกจากระบบ
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

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

.btn-cancel,
.btn-confirm {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
}

.btn-cancel {
    background: #e5e7eb;
    color: #1f2937;
}

.btn-confirm {
    background: #1e293b;
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
    .btn-confirm {
        width: 100%;
    }
}
</style>
