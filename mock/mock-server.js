const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:mock-server')

const mockDir = path.join(process.cwd(), 'mock')

function registerRoutes(app, pMockStartIndex, pMockRoutesLength) {

  let tail = []
  let mockLastIndex
  // save tail and remove old mock ruoters
  // app._router.stack = | head | + | mock ruoters | + | tail(static...) |
  debug('pMockStartIndex, pMockRoutesLength, app._router.stack.length', pMockStartIndex, pMockRoutesLength, app._router.stack.length)
  if (pMockRoutesLength > 0){
    if (pMockStartIndex + pMockRoutesLength < app._router.stack.length) {
      tail = [...(app._router.stack.slice(pMockStartIndex + pMockRoutesLength, app._router.stack.length))]
    }
    app._router.stack.splice(pMockStartIndex, app._router.stack.length)
  }

  const { default: mocks } = require('./index.js')
  for (const mock of mocks) {
    debug('app registerRoutes', mock.type, mock.url)
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }

  // concat tail
  debug('tail.length', tail.length)
  if (tail.length > 0) {
    app._router.stack = app._router.stack.concat(tail)
  }

  const mockRoutesLength = Object.keys(mocks).length

  // debug('mockRoutesLength, mockLastIndex, mockRoutesLength, tail.length', mockRoutesLength, mockLastIndex, mockRoutesLength, tail.length)
  // for (i in app._router.stack) {
  //   debug('registerRoutes state', i, app._router.stack[i].name, app._router.stack[i].regexp.toString().replace('\n',' '), app._router.stack[i].path)
  // }

  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

module.exports = app => {
  // es6 polyfill
  require('@babel/register')

  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.all('/mock/*', bodyParser.json())
  app.all('/mock/*', bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app, 0, 0)
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        // app._router.stack.splice(mockStartIndex, mockRoutesLength)

        // clear routes cache
        unregisterRoutes()

        const mockRoutes = registerRoutes(app, mockStartIndex, mockRoutesLength)

        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
