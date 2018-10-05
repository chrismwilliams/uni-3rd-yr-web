<template>
  <div class="map-pg">
    <h1 class="page_heading">Find Your Next Course</h1>
    <section class="map_section">
      <div class="field search_bar">
        <div class="control has-icon-left" aria-label="Search for courses">
          <span class="icon is-small is-left" @click="focusSearch">
            <i aria-hidden="true" class="fas fa-search"></i>
          </span>
          <input type="text" name="search" ref="search" aria-label="Search" placeholder="Enter an address...">
        </div>
      </div>
      <div class="map" ref="map">     
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "MapComponent",
  data() {
    return {
      mapOptions: {
        center: { lat: 52.195731, lng: -2.226148 },
        mapTypeId: "roadmap",
        maxZoom: 16
      }
    };
  },
  methods: {
    focusSearch() {
      this.$refs.search.focus();
    },
    setSearch(map) {
      const autoComplete = new google.maps.places.Autocomplete(
        this.$refs.search
      );
      autoComplete.addListener("place_changed", () => {
        let place = autoComplete.getPlace();
        if (!place || !place.geometry) return;
        this.showCourses(
          map,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      });
    },
    showCourses(map, lat = 52.195731, lng = -2.226148) {
      axios
        .post("/api/courses/find", {
          lat,
          lng
        })
        .then(r => {
          if (!r.data.length) {
            return this.$eventBus.$emit("msg", {
              status: "is-info",
              header: "Info",
              message: "No courses found in this area"
            });
          }
          let courses = r.data;
          let bounds = new google.maps.LatLngBounds();

          let markers = courses.map(course => {
            let position = {
              lat: parseFloat(course.lat),
              lng: parseFloat(course.lng)
            };
            bounds.extend(position);
            let marker = new google.maps.Marker({ map, position });
            marker.course = course;
            return marker;
          });

          this.createMarkers(map, markers);
          map.setCenter(bounds.getCenter());
          map.fitBounds(bounds);
        });
    },
    createMarkers(map, markers) {
      let infoWindow = new google.maps.InfoWindow();

      markers.forEach(marker =>
        marker.addListener("click", function() {
          const html = `
              <a class="courseWindow card" href="/courses/${this.course.slug}">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="/storage/courses/${this.course.thumbnail}" alt="${
            this.course.name
          } picture" />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="content">
                    <p class="title is-6">${this.course.name}</p>
                    <p class="subtitle is-7">${this.course.address}</p>
                  </div>
                </div>
              </a>
            `;
          infoWindow.setContent(html);
          infoWindow.open(map, this);
        })
      );
    },
    createMap() {
      const gMap = new google.maps.Map(this.$refs.map, this.mapOptions);
      this.showCourses(gMap);
      this.setSearch(gMap);
    }
  },
  mounted() {
    // if ('geolocation' in navigator) {
    //   this.userCoords = navigator.geolocation.getCurrentPosition();
    // } else {
    //   this.userCoords = false;
    // }
    this.createMap();
  }
};
</script>