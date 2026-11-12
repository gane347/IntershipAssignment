import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
const app = createApp();
describe("items", () => {
    it("creates and reads an item", async () => {
        const created = await request(app).post("/api/v1/items").send({ name: "first" });
        expect(created.status).toBe(201);
        const fetched = await request(app).get(`/api/v1/items/${created.body.id}`);
        expect(fetched.body.name).toBe("first");
    });
    it("rejects an empty name", async () => {
        const res = await request(app).post("/api/v1/items").send({ name: "" });
        expect(res.status).toBe(400);
    });
});
