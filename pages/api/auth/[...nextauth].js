import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import authorizeUser from 'services/users/authorize';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await authorizeUser({
          email: credentials.email,
          password: credentials.password
        });

        if (user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('user', user);
      if (user) {
        token.name = user?.fullName;
        token.role = user?.role;
        token.id = user?.id;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token?.role;
      session.user.id = token?.id;

      return session;
    }
  }
};

export default NextAuth(authOptions);
