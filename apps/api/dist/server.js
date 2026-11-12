import { createApp } from "./app.js";
import { env } from "./core/env.js";
import { prisma } from "./core/db.js";
const server = createApp().listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
        server.close();
        await prisma.$disconnect();
        process.exit(0);
    });
}
