/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import "./bootstrap";

// bulma
//import "bulma/css/bulma.css";

import Vue from "vue";

// setup event bus
Vue.prototype.$eventBus = new Vue();

// all our vue components
Vue.component("nav-search", require("./components/NavSearch.vue"));

Vue.component("map-component", require("./components/Map.vue"));

Vue.component("add-comment", require("./components/comment/AddComment.vue"), {
  props: ["courseid"]
});

Vue.component("add-course", require("./components/AddCourse.vue"), {
  props: ["tags", "old", "errors"]
});

Vue.component("update-course", require("./components/UpdateCourse.vue"), {
  props: ["current", "currentTags", "tags", "old", "errors"]
});

Vue.component("reviews-component", require("./components/Reviews.vue"), {
  props: ["comms"]
});

Vue.component("bookmark-component", require("./components/Bookmark.vue"), {
  props: ["courseid"]
});

Vue.component("register-component", require("./components/auth/Register.vue"), {
  props: ["old", "errors"]
});

Vue.component("login-component", require("./components/auth/Login.vue"), {
  props: ["old", "errors"]
});

Vue.component("modal-component", require("./components/Modal.vue"));

// new vuejs root instance
const app = new Vue({
  el: "#app",
  data: {
    token: document.head.querySelector('meta[name="csrf-token"]')["content"],
    mobSearchOpen: false,
    mobAccountOpen: false,
    showModal: false,
    status: "",
    header: "",
    message: ""
  },
  methods: {
    // toggle the mobile menu
    toggleMobile(el) {
      if (el == "search") {
        this.mobAccountOpen = false;

        if (this.mobSearchOpen) {
          this.mobSearchOpen = false;
        } else {
          this.mobSearchOpen = true;
        }
      } else {
        this.mobSearchOpen = false;

        if (this.mobAccountOpen) {
          this.mobAccountOpen = false;
        } else {
          this.mobAccountOpen = true;
        }
      }
    },
    openModal() {
      this.showModal = true;
      let that = this;
      setTimeout(() => {
        that.showModal = false;
      }, 4000);
    }
  },
  created() {
    this.$eventBus.$on("msg", data => {
      (this.status = data.status),
        (this.header = data.header),
        (this.message = data.message),
        this.openModal();
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("msg");
  }
});
