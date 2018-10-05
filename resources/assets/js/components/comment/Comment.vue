<template>
  <div class="course_review">
    <div class="review_body">
      <div class="review_header">
        <div v-if="!editMode" class="review_user">
          <img class="gravatar" :src="comment.gravatar" alt="User Gravitar">
          <p>{{ comment.username }}</p>
        </div>
        <div v-else class="review_edit_msg">
          <p>Please update your comment</p>
        </div>
        <div v-if="!editMode" class="review_rating">{{ comment.rating | stars }}</div>
        <div v-else class="review_rating">
          <star-component :default="comment.rating" @selected="updateRating"></star-component>
        </div>
        <div v-if="!editMode" class="review_time">{{ comment.updated_at }}</div>
      </div>
      <div class="user_review">
        <p v-if="!editMode">{{ comment.comment }}</p>
        <div v-else>
          <div class="field">
            <div class="control">
              <textarea class="textarea" name="comment" id="comment" v-model.trim="form.comment" @keydown="form.errors.clear('comment')"></textarea>
            </div>
          </div>
            <p v-if="form.errors.any()" v-for="(err,index) in form.errors.all()" :key="index" class="help is-danger" v-text="form.errors.get(err)"></p>
          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <a class="button is-primary" @click="updateMsg">Save</a>
            </div>
            <div class="control" @click="editMode = false">
              <a class="button is-light">Cancel</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="review_edit">
      <div v-if="comment.canEdit && !editMode">
        <div @click="editMode = true" aria-label="Edit">Edit Review<i aria-hidden="true" class="fas fa-pencil-alt fa-lg has-text-link"></i></div>
        <div @click="confirmModal = true" aria-label="Delete">Delete Review<i aria-hidden="true" class="fas fa-trash-alt fa-lg has-text-danger"></i></div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="confirmModal" class="review_delete modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <p class="has-text-centered">Are you sure you want to delete your comment?</p>
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-danger" @click="deleteMsg">Delete Message</a>
            </div>
            <div class="control" @click="confirmModal = false">
              <a class="button is-light">Cancel</a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import StarComponent from "./Star";
import { updateFormRating } from "../../mixins";
import Form from "../../Form";

export default {
  name: "Comment",
  props: ["comment"],
  mixins: [updateFormRating],
  components: {
    StarComponent
  },
  data() {
    let commentForm = new Form(
      {
        comment_id: this.comment.id,
        comment: "",
        rating: 0
      },
      this.comment
    );
    return {
      form: commentForm,
      editMode: false,
      confirmModal: false
    };
  },
  filters: {
    stars(num) {
      return "★".repeat(num) + "☆".repeat(5 - num);
    }
  },
  methods: {
    updateMsg() {
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
        const formData = this.form.data();
        this.form.post("/api/courses/comments/update").then(data => {
          this.$eventBus.$emit("newcomments", data);
          this.$eventBus.$emit("msg", {
            status: "is-success",
            header: "Success",
            message: "Your message has been updated"
          });
          this.editMode = false;
          this.form.comment_id = formData.comment_id;
          this.form.comment = formData.comment;
          this.form.rating = formData.rating;
        });
      }
    },
    deleteMsg() {
      this.form
        .post("/api/courses/comments/delete")
        .then(() => {
          location.reload();
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }
};
</script>

