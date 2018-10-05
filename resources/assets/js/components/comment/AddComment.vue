<template>
  <div>
    <div v-if="!msgPosted">
      <form method="POST" :action="`/courses/${courseid}/comments`" @submit.prevent="submitReview" @keydown="form.errors.clear($event.target.name)">
        <h3>Enter a Review</h3>
        <div>
          <div class="field">
            <label class="label" for="comment">Comment</label>
              <p v-if="form.errors.any()" v-for="(err,index) in form.errors.all()" :key="index" class="help is-danger" v-text="form.errors.get(err)"></p>
            <div class="control">
              <textarea class="textarea" name="comment" id="comment" placeholder="If you liked the course, please leave a review..." v-model.trim="form.comment"></textarea>
            </div>
          </div>
          <div class="form_footer">
            <star-component :default="0" @selected="updateRating"></star-component>
            <button class="button is-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
    <h3 v-else><em>Thank you for your comment!</em></h3>
  </div>
</template>

<script>
import StarComponent from "./Star";
import { updateFormRating } from "../../mixins";
import Form from "../../Form";

export default {
  name: "AddComment",
  props: ["courseid", "errors"],
  mixins: [updateFormRating],
  components: {
    StarComponent
  },
  data() {
    let commentForm = new Form({
      comment: "",
      rating: 0
    });
    commentForm.errors.record(this.errors);
    return {
      form: commentForm,
      msgPosted: false
    };
  },
  methods: {
    submitReview() {
      if (this.form.comment.length < 7) {
        this.form.errors.recordOne({
          name: "comment",
          message: "The comment field is required, with at least 7 characters"
        });
      }

      if (this.form.rating < 1 || this.form.rating > 5) {
        this.form.errors.recordOne({
          name: "rating",
          message: "A star rating of between 1 and 5 is required"
        });
      }

      if (this.form.isSet() && !this.form.errors.any()) {
        //post and fetch data
        this.form
          .post(`/api/courses/${this.courseid}/comments`)
          .then(data => {
            if (data.length) {
              this.$eventBus.$emit("newcomments", data);
              this.$eventBus.$emit("msg", {
                status: "is-success",
                header: "Success",
                message: "Your message has been added"
              });
              this.msgPosted = true;
            }
          })
          .catch(err => {
            console.warn(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.field,
.label {
  margin-bottom: 0;
}

.field {
  .help {
    margin: 0;
  }
}
</style>


