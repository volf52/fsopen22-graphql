const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { execute, subscribe } = require("graphql");
const { WebSocket } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const express = require("express");
const http = require("node:http");

const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolvers");

const { connectDb } = require("./db");
const userService = require("./services/user");

const start = async () => {
  await connectDb();
  console.log("Connected to mongo");

  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocket.Server({
    server: httpServer,
    path: "/",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decoded = userService.decodeToken(auth.substring(7));

        const currentUser = await userService.findById(decoded.id);

        return { currentUser };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app, path: "/" });

  return { app, httpServer, wsServer };
};

module.exports = { start };
