<template>
  <form class="form" method="POST" :action="`/courses/${current.slug}/update`" enctype="multipart/form-data" @submit="checkForm" @keydown="form.errors.clear($event.target.name)">
    <h1>Update: {{form.name}}</h1>
    <input type="hidden" name="_token" :value="this.$root.token">

    <div class="field">
      <label class="label" for="name">Course Name</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('name') }" id="name" name="name" type="text" placeholder="Please enter the course name" v-model.trim="form.name" @keydown="form.errors.clear('course')" required>
        <span class="icon is-small is-left">
          <i class="fas fa-golf-ball"></i>
        </span>
      </div>
      <p v-if="form.errors.has('name')" class="help is-danger" v-text="form.errors.get('name')"></p>
      <p v-if="form.errors.has('course')" class="help is-danger" v-text="form.errors.get('course')"></p>
    </div>

    <div class="field">
      <label class="label" for="desc">Description</label>
      <div class="control">
        <textarea class="textarea" :class="{ 'is-danger': form.errors.has('description') }" name="description" id="desc" placeholder="Please Enter A Brief Description" v-model.trim="form.description" required></textarea>
      </div>
      <p v-if="form.errors.has('description')" class="help is-danger" v-text="form.errors.get('description')"></p>
    </div>

    <p class="input_label">Image</p>
    <div class="img_container">
      <figure class="image is-2by1">
        <img :src="`/storage/courses/${current.img_src}`" :alt="`Current ${form.name} image`">
      </figure>
    </div>
    <div class="field">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input class="file-input" type="file" name="image" accept="image/*" id="file" ref="image" @change="updateImg">
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Choose a new image if required…
            </span>
          </span>
          <span class="file-name" v-if="imgName">
            {{ imgName.substring(0,30) }}
          </span>
        </label>
      </div>
      <p v-if="form.errors.has('image')" class="help is-danger" v-text="form.errors.get('image')"></p>
    </div>

    <div class="field">
      <label class="label" for="address">Address</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('address') }" id="address" name="address" type="text" v-model.trim="form.address" required>
        <span class="icon is-small is-left">
          <i class="fas fa-home"></i>
        </span>
      </div>
      <p v-if="form.errors.has('address')" class="help is-danger" v-text="form.errors.get('address')"></p>
    </div>
    
    <div class="field">
      <label class="label" for="lat">Latitude</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('lat') }" id="lat" name="lat" type="text" v-model.trim="form.lat" required>
        <span class="icon is-small is-left">
          <i class="fas fa-location-arrow"></i>
        </span>
      </div>
      <p v-if="form.errors.has('lat')" class="help is-danger" v-text="form.errors.get('lat')"></p>
    </div>
    
    <div class="field">
      <label class="label" for="lng">Longitude</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('lng') }" id="lng" name="lng" type="text" v-model.trim="form.lng" required>
        <span class="icon is-small is-left">
          <i class="fas fa-location-arrow"></i>
        </span>
      </div>
      <p v-if="form.errors.has('lng')" class="help is-danger" v-text="form.errors.get('lng')"></p>
    </div>
    
    <div class="field">
      <label class="label" for="tel">Tel No.</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('tel_no') }" id="tel" name="tel_no" type="text" v-model.trim="form.tel_no" required>
        <span class="icon is-small is-left">
          <i class="fas fa-phone"></i>
        </span>
      </div>
      <p v-if="form.errors.has('tel_no')" class="help is-danger" v-text="form.errors.get('tel_no')"></p>
    </div>
    
    <div class="field">
      <label class="label" for="website">Website URL</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('website') }" id="website" name="website" type="text" placeholder="www.domain.co.uk" v-model.trim="form.website" required>
        <span class="icon is-small is-left">
          <i class="fas fa-external-link-alt"></i>
        </span>
      </div>
      <p v-if="form.errors.has('website')" class="help is-danger" v-text="form.errors.get('website')"></p>
    </div>

    <p class="input_label">Tags</p>
    <div class="field is-grouped form_tags" v-if="tags">
      <p role="group" aria-label="Course tags to ammend" class="control" v-for="tag in tags" :key="tag.id">
        <label class="checkbox">
          <input type="checkbox" :id="tag.id" name="tags[]" :value="tag.id" @click="form.errors.clear('tags')" v-model="form.tags">
          {{ tag.tag_name }}
        </label>
      </p>
      <p v-if="form.errors.has('tags')" class="tag_error help is-danger" v-text="form.errors.get('tags')"></p>
    </div>

    <div class="field">
      <label class="label" for="weekCost">WeekDay Cost</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('weekday_cost') }" id="weekCost" name="weekday_cost" type="text" placeholder="20.50" v-model.trim="form.weekday_cost" required>
        <span class="icon is-small is-left">
          <i class="fas fa-pound-sign"></i>
        </span>
      </div>
      <p v-if="form.errors.has('weekday_cost')" class="help is-danger" v-text="form.errors.get('weekday_cost')"></p>
    </div>
    
    <div class="field">
      <label class="label" for="weekendCost">Weekend Cost</label>
      <div class="control has-icons-left">
        <input class="input" :class="{ 'is-danger': form.errors.has('weekendCost') }" id="weekendCost" name="weekend_cost" type="text" placeholder="30.50" v-model.trim="form.weekend_cost" required>
        <span class="icon is-small is-left">
          <i class="fas fa-pound-sign"></i>
        </span>
      </div>
      <p v-if="form.errors.has('weekend_cost')" class="help is-danger" v-text="form.errors.get('weekend_cost')"></p>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-primary" type="submit">Update →</button>
      </div>
    </div>
  </form>
</template>

<script>
import Form from "../Form";
import { updateImage } from "../mixins";

export default {
  name: "UpdateCourse",
  props: ["current", "currentTags", "tags", "old", "errors"],
  mixins: [updateImage],
  data() {
    let currentDetails;
    if (
      !Array.isArray(this.old) &&
      Object.getOwnPropertyNames(this.old).length > 0
    ) {
      currentDetails = this.old;
    } else {
      currentDetails = this.current;
      currentDetails.tags = this.currentTags;
    }

    let courseForm = new Form(
      {
        name: "",
        description: "",
        address: "",
        tel_no: "",
        lat: "",
        lng: "",
        tags: [],
        website: "",
        weekday_cost: "",
        weekend_cost: ""
      },
      currentDetails
    );
    courseForm.errors.record(this.errors);
    return {
      form: courseForm,
      imgName: ""
    };
  },
  methods: {
    checkForm(e) {
      let { tags } = this.form.data();

      if (tags.length < 1) {
        this.form.errors.recordOne({
          name: "tags",
          message: "Please select at least one tag"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  }
};
</script>
