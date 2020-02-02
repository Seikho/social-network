import { start } from './start'
import * as path from 'path'
const Parcel = require('parcel-bundler')

const entry = path.resolve(__dirname, '..', '..', 'web', 'index.html')
const options = {
  cacheDir: '.cache',
  autoInstall: false,
  hmr: true,
  watch: true,
  target: 'browser',
}

start()
const parcel = new Parcel(entry, options)
parcel.serve()
