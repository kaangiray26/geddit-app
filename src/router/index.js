import { createRouter, createWebHistory } from 'vue-router';

import User from '/components/User.vue';
import Home from '/components/Home.vue';
import Post from '/components/Post.vue';
import Search from '/components/Search.vue';
import Subreddit from '/components/Subreddit.vue';
import Subreddits from '/components/Subreddits.vue';
import Settings from '/components/Settings.vue';
import Gallery from '/components/Gallery.vue';
import Preview from '/components/Preview.vue';

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
        alias: ["/r/:subreddit?/comments/:id/:title?", "/comments/:id/:title?"],
        component: Post,
        name: "post",
        meta: {
            component: "post"
        },
    },
    {
        path: "/r/:id/:sort?",
        component: Subreddit,
        name: "subreddit",
        meta: {
            component: "subreddit"
        },
    },
    {
        path: "/u/:id/:page?",
        alias: "/user/:id/:page?",
        component: User,
        name: "user",
        meta: {
            component: "user"
        }
    },
    // Catch all other file requests
    {
        path: "/preview/:id/:ext",
        component: Preview,
        name: "preview",
        meta: {
            component: "preview"
        }
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