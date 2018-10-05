<template>
  <div class="bookmark" ref="bookmark" @click.prevent="updateBookmark">
    <i :class="[icon, 'fa-bookmark', 'fa-3x']"></i>
  </div>
</template>

<script>
export default {
  name: "Bookmark",
  props: ["courseid", "saved"],
  data() {
    return {
      isSaved: false
    };
  },
  computed: {
    icon() {
      return this.isSaved ? "fas" : "far";
    }
  },
  methods: {
    updateBookmark() {
      let uri = "/api/courses/bookmark" + (this.isSaved ? "/delete" : "");

      axios
        .post(uri, {
          course_id: this.courseid
        })
        .then(res => {
          this.isSaved = res.data.includes(this.courseid);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  },
  mounted() {
    this.isSaved = this.saved;
  }
};
</script>

