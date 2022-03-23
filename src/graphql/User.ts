import {
  arg,
  asNexusMethod,
  extendType,
  inputObjectType,
  nonNull,
  objectType,
} from 'nexus';
import { User } from 'nexus-prisma';
import { Context } from '../context';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JSONResolver } from 'graphql-scalars';

export const UserObject = objectType({
  name: 'User',
  definition(t) {
    t.field(User.username);
    t.field(User.password);
    t.field(User.name);
    t.field(User.initialBalance);
  },
});

export const TokenObject = objectType({
  name: 'Token',
  definition(t) {
    t.string('token');
  },
});
export const UserQuery = extendType({
  type: 'Query',

  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: async (_parent, _args, context: Context, info) => {
        const users = await context.prisma.user.findMany();
        return users;
      },
    });
  },
});

export const UserGetQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getUserByUsername', {
      type: 'User',

      args: {
        data: nonNull(
          arg({
            type: 'UserGetInput',
          })
        ),
      },
      resolve: async (_parent, _args, context: Context, info) => {
        const user = await context.prisma.user.findUnique({
          where: _args.data,
        });
        return user;
      },
    });
  },
});

export const UserLoginQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('userLogin', {
      type: 'Token',
      args: {
        data: nonNull(
          arg({
            type: 'UserLoginInput',
          })
        ),
      },
      resolve: async (_parent, _args, context: Context, info) => {
        console.log({ UserLoginInput });
        const user = await context.prisma.user.findUnique({
          where: {
            username: _args.data.username,
          },
        });

        if (!user) throw new Error('User not found');

        const isValid = await bcrypt.compare(
          _args.data.password,
          user.password
        );

        if (!isValid) throw new Error('Password invalid');

        const payload = {
          id: user.id,
          username: user.username,
        };

        const token = jwt.sign(payload, 'myJwtSecret', {
          expiresIn: '24h',
        });

        return { token };
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
      resolve: async (_parent, _args, context: Context, info) => {
        try {
          const hashedPassword = await bcrypt.hash(_args.data.password, 10);
          const user = await context.prisma.user.create({
            data: { ..._args.data, password: hashedPassword },
          });
          return user;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    });
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.field(User.username);
    t.field(User.password);
    t.field(User.name);
    t.field(User.initialBalance);
  },
});

export const UserGetInput = inputObjectType({
  name: 'UserGetInput',
  definition(t) {
    t.field(User.username);
  },
});

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.field(User.username);
    t.field(User.password);
  },
});
