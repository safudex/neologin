const axios = require('axios')
const { stringifyParams, convertHashToUrlParams } = require('./utils')

function handleResponse(response, resolve) {
  if (response.status === 200) {
    response.body = response.data
    resolve(response)
  }
}

function get(url, params) {
  return new Promise((resolve) => {
    const paramsString = convertHashToUrlParams(params)
    axios.get(url + '?' + paramsString)
        .then(response => handleResponse(response, resolve))
        .catch(error => console.log(error.response))
  })
}

function post(url, params) {
  return new Promise((resolve) => {
    return axios.post(url, stringifyParams(params), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => handleResponse(response, resolve))
    .catch(error => console.log(error.response))
  })
}

module.exports = { get, post }
