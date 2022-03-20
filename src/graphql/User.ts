import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('email');
    t.string('password');
    t.string('name');
    t.float('initialBalance');
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: async (_parent, _args, context, info) => {
        const users = await context.prisma.user.findMany();
        return users;
      },
    });
  },
});

export const SignupUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupUser', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateInput',
          })
        ),
      },
      resolve: async (_parent, _args, context, info) => {
        try {
          const user = await context.prisma.user.create({
            data: _args.data,
          });
          return user;
        } catch (error) {
          throw error;
        }
      },
    });
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.string('name');
    t.float('initialBalance');
  },
});
