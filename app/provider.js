"use client";
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { createOrGetUser } from './actions/user'

function Provider({children}) {
    const {user} = useUser();

    useEffect(() => {
        if (user) {
            const userData = {
                name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress
            };
            createOrGetUser(userData).catch(console.error);
        }
    }, [user]);

    return (
        <div>
            {children}
        </div>
    );
}

export default Provider;
