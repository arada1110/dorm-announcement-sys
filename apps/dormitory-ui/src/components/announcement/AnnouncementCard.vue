<template>
    <div class="card" @click="openDetail">
        <!-- TAG -->
        <div class="flex justify-between items-center">
            <span class="badge">
                {{ announcement.category }}
            </span>

            <span class="view-detail"> ดูรายละเอียด → </span>
        </div>

        <!-- TITLE -->
        <h2 class="title">
            {{ announcement.title }}
        </h2>

        <!-- DESCRIPTION -->
        <p class="description">
            {{ shortContent }}
        </p>

        <!-- DATE -->
        <div class="date">
            {{ formattedDate }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const props = defineProps({
    announcement: {
        type: Object,
        required: true,
    },
});

const openDetail = () => {
    router.push(`/resident/announcements/${props.announcement.public_id}`);
};

// ตัดข้อความให้สั้น
const shortContent = computed(() => {
    return props.announcement.content?.slice(0, 100) + "...";
});

// format วันที่
const formattedDate = computed(() => {
    const date = new Date(props.announcement.created_at);
    return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
});
</script>

<style scoped>
.card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    cursor: pointer;
    transition: all 0.2s ease;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

.badge {
    background: #ffedd5;
    color: #ea580c;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
}

.title {
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    color: #1f2937;
}

.description {
    margin-top: 6px;
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
}

.view-detail {
    font-size: 12px;
    color: #2563eb;
}

.view-detail:hover {
    text-decoration: underline;
}

.date {
    margin-top: 12px;
    font-size: 12px;
    color: #9ca3af;
}
</style>
