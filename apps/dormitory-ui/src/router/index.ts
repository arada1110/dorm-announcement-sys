import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import LoginView from "../views/auth/LoginView.vue";

import AdminLayout from "../layout/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AnnouncementList from "../views/admin/AnnouncementList.vue";
import InviteCode from "../views/admin/InviteCode.vue";

import ResidentLayout from "../layout/ResidentLayout.vue";
import ResidentAnnouncement from "../views/resident/ResidentAnnouncement.vue";
import AnnouncementDetailResident from "../views/resident/ResidentAnnouncementDetail.vue";
import ResidentProfile from "../views/resident/ResidentProfile.vue";
import PublicAnnouncements from "../../src/views/announcements/PublicAnnouncements.vue";
import PublicAnnouncementsAll from "../views/announcements/PublicAnnouncementsAll.vue";
import AnnouncementDetail from "../../src/views/announcements/AnnouncementDetail.vue";
import EditAnnouncement from "../views/admin/EditAnnouncement.vue";
import AdminLoginView from "../views/admin/AdminLoginView.vue";
import SettingLine from "../components/setting/admin/SettingLine.vue";

const routes: RouteRecordRaw[] = [
    // PUBLIC HOME PAGE (หน้าแรก)
    {
        path: "/",
        name: "public-announcements",
        component: PublicAnnouncements,
    },

    {
        path: "/announcements/all",
        name: "PublicAnnouncementsAll",
        component: PublicAnnouncementsAll,
    },

    // LOGIN PAGE
    {
        path: "/login",
        name: "login",
        component: LoginView,
    },

    {
        path: "/admin/login",
        name: "admin-login",
        component: AdminLoginView,
    },

    // PUBLIC ANNOUNCEMENT DETAIL
    {
        path: "/announcements/:id",
        name: "public-announcement-detail",
        component: AnnouncementDetail,
    },

    // ADMIN ROUTES
    {
        path: "/admin",
        component: AdminLayout,
        meta: { role: "ADMIN" },

        children: [
            {
                path: "",
                redirect: "/admin/dashboard",
            },
            {
                path: "dashboard",
                name: "admin-dashboard",
                component: AdminDashboard,
            },
            {
                path: "announcements",
                name: "admin-announcements",
                component: AnnouncementList,
            },
            {
                path: "announcements/:id/edit",
                name: "admin-announcement-edit",
                component: EditAnnouncement,
            },
            {
                path: "invites",
                name: "admin-invites",
                component: InviteCode,
            },
            {
                path: "settings",
                name: "admin-settings",
                component: SettingLine,
            },
        ],
    },

    // RESIDENT ROUTES
    {
        path: "/resident",
        component: ResidentLayout,
        meta: { role: "RESIDENT" },

        children: [
            {
                path: "",
                redirect: "/resident/announcements",
            },
            {
                path: "announcements",
                name: "resident-announcements",
                component: ResidentAnnouncement,
            },
            {
                path: "announcements/:id",
                name: "resident-announcement-detail",
                component: AnnouncementDetailResident,
            },
            {
                path: "profile",
                name: "resident-profile",
                component: ResidentProfile,
            },
        ],
    },

    {
        path: "/announcements",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ROUTE GUARD
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const publicRoutes = ["/", "/login", "/admin/login"];
    const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith("/announcements/");

    if (!token && !isPublicRoute) {
        return next(`/login?redirect=${to.fullPath}`);
    }
    if (token && to.path === "/login") {
        if (role === "ADMIN") return next("/admin/dashboard");
        if (role === "RESIDENT") return next("/resident/announcements");
    }
    if (to.meta.role && to.meta.role !== role) {
        if (role === "ADMIN") return next("/admin/dashboard");
        if (role === "RESIDENT") return next("/resident/announcements");
    }

    next();
});

export default router;
