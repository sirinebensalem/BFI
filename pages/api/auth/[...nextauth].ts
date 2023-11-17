import NextAuth, { NextAuthOptions, User } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions :NextAuthOptions = {
    pages:{
     signIn:'/login'
    },
   session:{
    strategy:'jwt'
   },
   providers:[
    CredentialsProvider({
        name: 'Sign in',
        credentials:{
            email:{ label:"Email",
            type:"email",
             placeholder:'hello@example.com'
            },
            password:{ label:"Password",type:"password"}
        },
        async authorize(credentials){
            if(!credentials?.email || !credentials.password){
                return null
            }
            const user = await prisma.user.findUnique({
                where : {
                    email: credentials.email
                }
            })
            if(!user){
                return null 
            }
            const ispasswordvalid = await compare(credentials.password, user.hashedPassword)
            if(!ispasswordvalid){
             return null
            }
 
            return {
                id: user.id + '',
                email: user.email,
                name: user.username,  
                role: user.role // Include user's role here

          }
         }

    })
   ],
   callbacks:{
    session: ({session,token}) => {
        console.log('session callback',{session,token})
        
        return{
            ...session,
            user: {
            ...session.user,
            id : token.id ,
            name: token.name,
            email: token.email,
            role: token.role // Include user's role in the session
        }
        }
        return session

    },
    jwt:({token, user}) => {
        console.log('JWT callback ',{token,user})
        if(user){
            const u = user as unknown as any
            return {
                ...token,
                id: u.id ,
                name: u.name,
                email: u.email,
                role: u.role // Include user's role in the JWT token
            }
        }
        return token

    }
   }
}

const handler = NextAuth(authOptions)
export default handler ;