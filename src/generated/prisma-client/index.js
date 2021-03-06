"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "ExternalGroupInvitation",
    embedded: false
  },
  {
    name: "GroupInvitation",
    embedded: false
  },
  {
    name: "ModerationStatus",
    embedded: false
  },
  {
    name: "Moderation",
    embedded: false
  },
  {
    name: "Post",
    embedded: false
  },
  {
    name: "Thread",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
