// src\lib\auth.ts
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_fallback');

interface MyJwtPayload extends JWTPayload {
  id: string;
  name: string;
  email: string;
}

export const generateToken = async (payload: MyJwtPayload) => {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('1d')
  .sign(JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as MyJwtPayload;
  } catch (error) {
    console.error('JWT Error:', error);
    return null;
  }
};
