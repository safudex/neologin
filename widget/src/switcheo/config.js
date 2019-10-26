const config = {
  API_URL: 'https://test-api.switcheo.network/v2',
  CONTRACT_HASH: 'a195c1549e7da61b8da315765a790ac7e7633b82'
}

module.exports = config

if (config.API_URL === '<api url>' || config.CONTRACT_HASH === '<contract hash>') {
  throw new Error('API_URL and CONTRACT_HASH has not been setup in src/config.js')
}
