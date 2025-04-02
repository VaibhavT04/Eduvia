'use server';

import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function createOrGetUser(userData) {
    try {
        const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, userData.email));
        
        if (result.length === 0) {
            const newUser = await db.insert(USER_TABLE).values({
                name: userData.name,
                email: userData.email
            }).returning({id: USER_TABLE.id});
            return newUser[0];
        }
        
        return result[0];
    } catch (error) {
        console.error('Error in createOrGetUser:', error);
        throw error;
    }
} 