<template>
    <TermsModal @accepted="onAccepted" @declined="onDeclined" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import TermsModal from "../../components/modal/TermsModal.vue";

export default defineComponent({
    name: "TermsView",

    components: { TermsModal },

    setup() {
        const router = useRouter();

        function onAccepted(): void {
            localStorage.setItem("terms_accepted", "true");
            router.push("/resident/announcements");
        }

        function onDeclined(): void {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            router.push("/login");
        }

        return { onAccepted, onDeclined };
    },
});
</script>
