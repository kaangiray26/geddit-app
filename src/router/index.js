import { createRouter, createWebHistory } from 'vue-router';

import Home from '/components/Home.vue';
import FullPost from '/components/FullPost.vue';

import User from '/components/User.vue';
import Subreddit from '/components/Subreddit.vue';
import Search from '/components/Search.vue';

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/post/:id",
        component: FullPost,
    },
    {
        path: "/u/:id",
        component: User
    },
    {
        path: "/r/:id",
        component: Subreddit
    },
    {
        path: "/search",
        component: Search
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    pages = pages.slice(-1);

    pages.push({
        path: from.path,
        scroll: document.querySelector('.content-view').scrollTop
    })
    localStorage.setItem("pages", JSON.stringify(pages));
    next();
});

export default router