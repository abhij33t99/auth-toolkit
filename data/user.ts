import { db } from "@/lib/db";
import bcrypt from 'bcryptjs'

export const getUserByEmail = async (email : string) =>{
    try {
        const user = await db.user.findUnique({where: {email}});
        return user;
    } catch (error) {
        return null;
    }
}

export const getUserById = async (id : string) =>{
    try {
        const user = await db.user.findUnique({where: {id}});
        return user;
    } catch (error) {
        return null;
    }
}

export const createUser = async ({name, email, password} : {
    name : string,
    email : string,
    password : string
}) => {
    try {
        const encrptedPass = await bcrypt.hash(password, 10)
        await db.user.create({
            data: {
                name,
                email,
                password: encrptedPass
            }
        })
        return true
    } catch (error) {
        return false
    }
}