import { buildApp } from "../server";

const app = await buildApp();
console.log(JSON.stringify(app.swagger(), null, 2));
