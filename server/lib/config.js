const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const directory = require('../../directory')

const configPath = path.join(directory.configPath, 'app.yaml')
const config = yaml.safeLoad(fs.readFileSync(configPath))

module.exports = config