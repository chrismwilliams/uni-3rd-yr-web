import Errors from "./Errors";

export default class Form {
  constructor(schema, oldData = {}) {
    this.originalData = schema;

    for (let field in schema) {
      oldData.hasOwnProperty(field)
        ? (this[field] = oldData[field])
        : (this[field] = schema[field]);
    }

    this.errors = new Errors();
  }

  data() {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    return data;
  }

  isSet() {
    for (let property in this.originalData) {
      if (this[property] === "") {
        this.errors.recordOne({
          name: property,
          message: "This field is required"
        });
      }
    }
    return true;
  }

  reset() {
    for (let field in this.originalData) {
      this[field] = "";
    }

    this.errors.clear();
  }

  post(url) {
    return this.submit("post", url);
  }

  submit(requestType, url) {
    return new Promise((resolve, reject) => {
      axios[requestType](url, this.data())
        .then(response => {
          this.onSuccess();
          resolve(response.data);
        })
        .catch(error => {
          this.onFail(error.response.data);

          reject(error.response.data);
        });
    });
  }

  onSuccess() {
    this.reset();
  }

  onFail(errors) {
    this.errors.record(errors);
  }
}
