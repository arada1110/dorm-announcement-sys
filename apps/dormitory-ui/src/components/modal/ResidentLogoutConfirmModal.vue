<script setup lang="ts">
const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="overlay" @click.self="emit('cancel')">
        <div class="modal">
            <!-- HEADER -->

            <div class="modal-header">
                <div class="icon-box text-4xl font-bold">⎋</div>

                <h2 class="text-lg font-semibold text-gray-800">ยืนยันการออกจากระบบ</h2>
            </div>

            <!-- BODY -->

            <p class="modal-message text-sm text-gray-500">คุณต้องการออกจากระบบใช่หรือไม่</p>

            <!-- FOOTER -->

            <div class="modal-footer">
                <button @click="emit('cancel')" class="btn-cancel text-sm font-medium">ยกเลิก</button>

                <button @click="emit('confirm')" class="btn-confirm text-sm font-semibold">ออกจากระบบ</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
}

.modal {
    width: 440px;
    max-width: calc(100vw - 32px);
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(253, 186, 116, 0.5);
    box-shadow: 0 20px 60px rgba(249, 115, 22, 0.18);
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-box {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #ffedd5;
    color: #f97316;
}

.modal-message {
    margin-top: 12px;
    line-height: 1.6;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancel {
    padding: 8px 16px;
    border-radius: 12px;
    background: #f3f4f6;
    color: #4b5563;
    transition: 0.2s ease;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-confirm {
    padding: 8px 16px;
    border-radius: 12px;
    color: white;
    background: linear-gradient(135deg, #fb923c, #f97316);
    box-shadow: 0 6px 18px rgba(249, 115, 22, 0.35);
    transition: 0.2s ease;
}

.btn-confirm:hover {
    background: linear-gradient(135deg, #f97316, #ea580c);
}

@media (max-width: 640px) {
    .modal-footer {
        flex-direction: column-reverse;
    }
    .btn-cancel,
    .btn-confirm {
        width: 100%;
    }
}
</style>
