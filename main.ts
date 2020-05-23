import { Application } from "abc";
import {
  create,
  fetchAll,
  fetchOne,
  update,
  deleteDog
} from "./controllers/app.ts";
import "dotenv";

const app = new Application();

const port = Number(Deno.env.get("SERVER_PORT")) || 3000;

// * start server
app.start({ port });

console.log(`server on port: ${Deno.env.get("SERVER_PORT")}`);

// * statics
app.static("/public", "assets");

app.file("/", "./public/index.html");

// * routes
app.get("api/dogs", fetchAll);
app.get("api/dogs/:id", fetchOne);
app.post("api/dogs", create);
app.put("api/dogs/:id", update);
app.delete("api/dogs/:id", deleteDog);