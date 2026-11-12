import bcrypt from "bcryptjs";
import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";
const publicUserSelect = {
    id: true,
    email: true,
    username: true,
    isSeller: true,
    createdAt: true,
};
export const authService = {
    register: async (input) => {
        const passwordHash = await bcrypt.hash(input.password, 12);
        try {
            return await prisma.user.create({
                data: {
                    email: input.email,
                    username: input.username,
                    passwordHash,
                    isSeller: input.isSeller,
                },
                select: publicUserSelect,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                throw new HttpError(409, "Email or username is already in use");
            }
            throw error;
        }
    },
    authenticate: async (identifier, password) => {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
        });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new HttpError(401, "Invalid email, username, or password");
        }
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            isSeller: user.isSeller,
            createdAt: user.createdAt,
        };
    },
    getPublicUser: (id) => prisma.user.findUnique({ where: { id }, select: publicUserSelect }),
};
