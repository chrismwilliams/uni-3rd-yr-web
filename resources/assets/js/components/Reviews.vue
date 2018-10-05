<template>
<div class="course_reviews_section" v-if="comments.length">
  <div class="level">
    <h3>User Reviews</h3>
    <div class="control">
      <div class="select">
        <select @change="updateReviews" aria-label="Sort Reviews">
          <option value="">Order Reviews</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>
    </div>
  </div>
  <transition-group name="transition_comments" tag="div" class="course_reviews" aria-live="polite" aria-relevant="additions removals">
    <comment 
      v-for="comment in comments" 
      :key="comment.id" 
      :comment="comment">
    </comment>
  </transition-group>
</div>
<div v-else class="course_reviews_section"></div>
</template>

<script>
import Comment from "./comment/Comment";

export default {
  name: "Reviews",
  props: ["comms"],
  components: { Comment },
  data() {
    return {
      comments: []
    };
  },
  methods: {
    updateReviews(e) {
      if (e.target.value === "") return;
      switch (e.target.value) {
        case "latest":
          this.comments.sort((a, b) => (a.date > b.date ? -1 : 1));
          break;
        case "oldest":
          this.comments.sort((a, b) => (a.date > b.date ? 1 : -1));
          break;
        case "highest":
          this.comments.sort((a, b) => (a.rating > b.rating ? -1 : 1));
          break;
        case "lowest":
          this.comments.sort((a, b) => (a.rating > b.rating ? 1 : -1));
      }
    }
  },
  created() {
    this.$eventBus.$on("newcomments", data => {
      this.comments = data.sort((a, b) => (a.date > b.date ? -1 : 1));
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("newcomments");
  },
  mounted() {
    if (this.comms.length) {
      this.comments = this.comms;
    }
  }
};
</script>


