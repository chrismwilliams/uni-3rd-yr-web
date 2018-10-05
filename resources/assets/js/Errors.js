export default class Errors {
  constructor(errorObj) {
    this.errors = {};
  }

  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  any() {
    return Object.keys(this.errors).length > 0;
  }

  all() {
    return Object.keys(this.errors);
  }

  get(field) {
    if (this.errors[field]) {
      return this.errors[field];
    }
  }

  record(errors) {
    if (errors.length) {
      errors.forEach(err => {
        let name = err.split(" ")[1];
        this.errors[name] = err;
      });
    }
  }

  recordOne(error) {
    this.errors[error.name] = error.message;
    this.errors = Object.assign({}, this.errors);
  }

  clear(field) {
    if (field) {
      delete this.errors[field];

      return;
    }

    this.errors = {};
  }
}
