/* global fetch */
import LokkaTransport from 'lokka/transport';
import fetch from 'isomorphic-fetch';

export class Transport extends LokkaTransport {
  constructor(endpoint, options = {}) {
    if (!endpoint) {
      throw new Error('endpoint is required!');
    }

    super();
    this._httpOptions = options;
    this.endpoint = endpoint;
  }

  _buildOptions(payload) {
    const options = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // To pass cookies to the server. (supports CORS as well)
      credentials: 'include',
    };

    return Object.assign(options, this._httpOptions);
  }

  send(query, variables, operationName) {
    const payload = {query, variables, operationName};
    const options = this._buildOptions(payload);

    return fetch(this.endpoint, options).then(response => {
      // 200 is for success
      // 400 is for bad request
      if (response.status !== 200 && response.status !== 400) {
        throw new Error(`Invalid status code: ${response.status}`);
      }

      return response.json();
    }).then(({data, errors}) => {
      if (errors) {
        const message = errors[0].message;
        const error = new Error(`GraphQL Error: ${message}`);
        error.rawError = errors;

        throw error;
      }

      return data;
    });
  }
}

export default Transport;
