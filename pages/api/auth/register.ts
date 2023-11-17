// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"

import bcrypt from "bcrypt"

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, email, password,role} = req.body;
      if(!email || !password){
        return new NextResponse("missing name , email, or password ", {status:400});
        }    const exist = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (exist){
                return new NextResponse("user already exists" , {status: 400});
            }
      // TODO: Validate input data
      const hashedPassword = await bcrypt.hash(password,10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          hashedPassword, 
          role
        },
      });

      res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
