<template>
  <div class="review_stars">
    <p>{{`${selectedStar} star`}}</p>
    <label v-for="star in stars" :key="star" :class="{'hover' : star <= hoveredStar, 'selected' : star <= selectedStar}" @mouseover="starHover(star)" @mouseout="hoveredStar = 0">
      <input :id="`${star}star`" type="radio" @click="clickStar(star)" />{{star}} stars
    </label>
    <input type="hidden" name="rating" :value="selectedStar">
  </div>
</template>

<script>
export default {
  name: "StarComponent",
  props: ["default"],
  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      hoveredStar: 0,
      selectedStar: 0
    };
  },
  methods: {
    clickStar(starID) {
      if (starID == this.selectedStar) {
        this.selectedStar = 0;
      } else {
        this.selectedStar = starID;
      }
      this.$emit("selected", this.selectedStar);
    },
    starHover(starID) {
      this.hoveredStar = starID;
    }
  },
  filters: {
    stars(num) {
      return "★".repeat(num) + "☆".repeat(5 - num);
    }
  },
  created() {
    if (this.default > 0) {
      this.selectedStar = this.default;
    }
  }
};
</script>
