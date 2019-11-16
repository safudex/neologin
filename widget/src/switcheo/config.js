const config = {
  API_URL: 'https://api.switcheo.network/v2',
  CONTRACT_HASH: 'a32bcf5d7082f740a4007b16e812cf66a457c3d4'
}

module.exports = config

if (config.API_URL === '<api url>' || config.CONTRACT_HASH === '<contract hash>') {
  throw new Error('API_URL and CONTRACT_HASH has not been setup in src/config.js')
}
