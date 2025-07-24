import { NextResponse } from 'next/server';
import User from '@/app/lib/models/users';
import { connect } from '@/app/lib/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';


import bcrypt from 'bcrypt';


export const POST = async (req) => {
    try {
        const body = await req.json();
        await connect();
        const { password , username} = body;
        const newUser = await User.findOne({username});
        const verify = await bcrypt.compare(password, newUser.password);

        if(!verify){
            return  NextResponse.json({error : "Wrong Username or Password"}, {status : 400})
        }
        if(!newUser){
            return  NextResponse.json({error : "User not found"}, {status : 400})
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({username})
            .setProtectedHeader({ alg: 'HS256' }) 
            .setIssuedAt()                       
            .setExpirationTime('7h')             
            .sign(secret);  
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 7 * 60 * 60);
        const cookie = await cookies()
        await cookie.set("session", token, {
            domain: process.env.NODE_ENV === "production" ? "sim-vest.vercel.app" : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: expiresAt,
          });
        console.log("signed in")
      
       
        return NextResponse.json({user : newUser}, {status : 200 })
    } catch (error) {
        return  NextResponse.json({error : error}, {status : 400})
    }
}