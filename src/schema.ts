import { makeSchema, fieldAuthorizePlugin } from 'nexus';
import { join } from 'path';
import * as types from './graphql';
export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '..', 'generated/nexus.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  plugins: [fieldAuthorizePlugin()],
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});
