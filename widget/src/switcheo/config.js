const config = {
  API_URL: 'https://api.switcheo.network/v2',
  CONTRACT_HASH: '91b83e96f2a7c4fdf0c1688441ec61986c7cae26'
}

module.exports = config

if (config.API_URL === '<api url>' || config.CONTRACT_HASH === '<contract hash>') {
  throw new Error('API_URL and CONTRACT_HASH has not been setup in src/config.js')
}
