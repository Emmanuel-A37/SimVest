import { NextResponse } from 'next/server';
import User from '@/app/lib/models/users';
import { connect } from '@/app/lib/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { TextEncoder } from 'util';
import bcrypt from 'bcrypt';

export const POST = async (req) => {
    try {
        const body = await req.json();
 
        await connect();
        const { password, username } = body;

        // Check if username or password is missing
        if (!password || !username) {
            return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBody = { ...body, password: hashedPassword };
        const newUser = await User.create(newBody);
        newUser.financialMetrics.stocks.investmentValue = 0;
        newUser.financialMetrics.crypto.investmentValue = 0;

        await newUser.save();

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ username })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7h')
            .sign(secret);

        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 7 * 60 * 60);
        const cookie = await cookies();
        await cookie.set("session", token, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
        });

        return NextResponse.json({ user: newUser }, { status: 200 });
    } catch (error) {
        console.error("Error during signup:", error); // Log the error to the console
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
};
