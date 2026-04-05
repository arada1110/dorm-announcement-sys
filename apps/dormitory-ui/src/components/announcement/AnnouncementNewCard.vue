<script setup lang="ts">
import { ArrowRight, CalendarDays } from "lucide-vue-next";
import { computed } from "vue";

type CategoryName = "GENERAL" | "ROOM" | "BUILDING" | "PAYMENT" | "MAINTENANCE";

const props = defineProps<{
    title: string;
    content: string;
    createdAt: string;
    categoryName: CategoryName | string;
}>();

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const categoryMeta = computed(() => {
    const map: Record<CategoryName, { label: string; className: string }> = {
        GENERAL: {
            label: "ข่าวทั่วไป",
            className: "bg-sky-100 text-sky-700",
        },
        ROOM: {
            label: "ข่าวเฉพาะห้อง",
            className: "bg-violet-100 text-violet-700",
        },
        BUILDING: {
            label: "ข่าวเฉพาะอาคาร",
            className: "bg-green-100 text-green-700",
        },
        PAYMENT: {
            label: "การชำระเงิน",
            className: "bg-red-100 text-red-700",
        },
        MAINTENANCE: {
            label: "การซ่อมบำรุง",
            className: "bg-amber-100 text-amber-700",
        },
    };

    return map[props.categoryName as CategoryName] ?? map.GENERAL;
});
</script>

<template>
    <article class="card-ui">
        <div class="mb-3">
            <span class="badge-ui" :class="categoryMeta.className">
                {{ categoryMeta.label }}
            </span>
        </div>

        <h2 class="card-title">
            {{ props.title }}
        </h2>

        <p class="card-body">
            {{ props.content }}
        </p>

        <div class="flex items-center justify-between mt-4 pt-4 border-t border-orange-100">
            <span class="meta-text">
                <CalendarDays :size="14" />
                {{ formatDate(props.createdAt) }}
            </span>

            <span class="flex items-center gap-1.5 text-orange-500 font-medium">
                อ่านต่อ
                <ArrowRight :size="14" />
            </span>
        </div>
    </article>
</template>
