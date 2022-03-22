import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { User } from 'nexus-prisma';
export const UserObject = objectType({
  name: 'User',
  definition(t) {
    t.field(User.email);
    t.field(User.password);
    t.field(User.name);
    t.field(User.initialBalance);
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

export const UserGetQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('userGetByEmail', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: 'UserGetInput',
          })
        ),
      },
      resolve: async (_parent, _args, context, info) => {
        const user = await context.prisma.user.findUnique({
          where: _args.data,
        });
        return user;
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
    t.field(User.email);
    t.field(User.password);
    t.field(User.name);
    t.field(User.initialBalance);
  },
});

export const UserGetInput = inputObjectType({
  name: 'UserGetInput',
  definition(t) {
    t.field(User.email);
  },
});
