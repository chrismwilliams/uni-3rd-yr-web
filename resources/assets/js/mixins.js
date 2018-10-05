exports.updateFormRating = {
  methods: {
    updateRating(rating) {
      this.form.errors.clear();
      this.form.rating = rating;
    }
  }
};

exports.updateImage = {
  methods: {
    updateImg() {
      let input = this.$refs.image;
      this.form.errors.clear("image");
      // check if correct format
      if (input.files && input.files[0]) {
        this.imgName = input.files[0].name;
      } else {
        this.errMsg = "Please upload an image";
      }
    }
  }
};

exports.validateEmail = {
  methods: {
    checkEmail(email) {
      const emailRegEx = /\S+@\S+\.\S+/;
      return emailRegEx.test(email);
    }
  }
};
