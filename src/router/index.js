import { createRouter, createWebHistory } from 'vue-router';


import User from '/components/User.vue';
import UserOverview from '/components/UserOverview.vue';
import UserPosts from '/components/UserPosts.vue';
import UserComments from '/components/UserComments.vue';

import Home from '/components/Home.vue';
import Post from '/components/Post.vue';
import Search from '/components/Search.vue';
import Subreddit from '/components/Subreddit.vue';
import Subreddits from '/components/Subreddits.vue';
import Settings from '/components/Settings.vue';
import Gallery from '/components/Gallery.vue';

const routes = [
    {
        path: "/",
        component: Home,
        name: "home",
        meta: {
            component: "home"
        }
    },
    {
        path: "/subreddits",
        component: Subreddits,
        name: "subreddits",
        meta: {
            component: "subreddits"
        }
    },
    {
        path: "/search",
        component: Search,
        name: "search",
        meta: {
            component: "search"
        },
    },
    {
        path: "/settings",
        component: Settings,
        name: "settings",
        meta: {
            component: "settings"
        },
    },
    {
        path: "/gallery",
        component: Gallery,
        name: "gallery",
        meta: {
            component: "gallery"
        },
    },
    {
        path: "/post/:id",
        component: Post,
        name: "post",
        meta: {
            component: "post"
        },
    },
    {
        path: "/r/:id",
        component: Subreddit,
        name: "subreddit",
        meta: {
            component: "subreddit"
        },
    },
    {
        path: "/u/:id",
        component: User,
        name: "user",
        meta: {
            component: "user"
        }
    },
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