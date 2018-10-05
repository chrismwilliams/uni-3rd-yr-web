<template>
  <div class="nav_search">
    <div class="search_box">
      <input type="text" aria-label="Search" placeholder="Search..." name="search" v-model="userSearch" @keyup="findCourses">
      <div class="search_results" v-if="results.length">
        <ul>
          <li v-for="(course, index) in results" :key="index"><a :href="`/courses/${course.slug}`">{{ course.name }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavSearch",
  data() {
    return {
      userSearch: "",
      results: []
    };
  },
  methods: {
    findCourses() {
      if (this.userSearch.length < 2) return this.results.splice(0);

      axios
        .post("/api/courses/search", {
          search: this.userSearch
        })
        .then(res => {
          if (res.data) {
            this.results = res.data;
          }
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }
};
</script>
