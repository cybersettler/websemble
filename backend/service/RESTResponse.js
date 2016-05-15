/**
 * Backend response.
 * @constructor
 * @param {string} url - Resource locator.
 * @param {string} method - Method used in the Request.
 * @param {Object|string} body - The body of the response.
 */
function RESTResponse(url, method, body) {
  /** The original request. */
  this.request = {
    url: url,
    method: method
  };
  /** The body of the response. */
  this.body = body || "";
  /** Status of the response. */
  this.status = "200";
}

module.exports = RESTResponse;
