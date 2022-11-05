const http = require("http")
const app = require("./src/app")
const config = require("./src/config")

app.start().then(({ httpServer }) => {
  return httpServer.listen({ port: config.PORT }, () => {
    console.log(`Server ready at http://localhost:${config.PORT}`)
  })
})
