import { v4 as uuid } from "uuid";
import { Database } from "bun:sqlite";

// if the database does not exist, it will be created
const db = new Database("data.sqlite", { create: true });
// create the uploads table if it does not exist
// --------------------
// | uuid | fileName |
// --------------------

const query = db.query(
  "CREATE TABLE IF NOT EXISTS uploads (uuid TEXT PRIMARY KEY, fileName TEXT)",
);
query.run();

const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);

    // helper function to add CORS headers to responses
    const addCORSHeaders = (response: Response) => {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS",
      );
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    };

    // options preflight request
    if (req.method === "OPTIONS") {
      return addCORSHeaders(new Response(null, { status: 204 }));
    }

    // return index.html for root path
    if (url.pathname === "/")
      return addCORSHeaders(
        new Response(Bun.file("index.html"), {
          headers: {
            "Content-Type": "text/html",
          },
        }),
      );

    // parse formdata at /upload
    if (url.pathname === "/upload" && req.method === "POST") {
      const formdata = await req.formData();
      const file = formdata.get("file");
      const fileName = formdata.get("fileName");
      if (!file) throw new Error("Must upload a file.");
      if (!fileName) throw new Error("Must provide a file name.");
      // store the file name in the database
      const id = uuid();
      const query = db.query(
        "INSERT INTO uploads (uuid, fileName) VALUES ($id, $fileName)",
      );
      query.run({ $id: id, $fileName: fileName.toString() });
      // write the file to the storage directory
      await Bun.write(`storage/${id}`, file);
      // return the id of the file
      return addCORSHeaders(new Response(id));
    }

    // serve files from the uploads directory
    if (url.pathname.startsWith("/storage/")) {
      const id = url.pathname.slice(9);
      const query = db.query("SELECT fileName FROM uploads WHERE uuid = $id");
      const fileName = (query.get({ $id: id }) as { fileName: string })
        .fileName;
      if (!fileName) return new Response("Not Exists", { status: 404 });
      let file = Bun.file(`storage/${id}`);
      if (!file) {
        console.log("File Lost");
        return new Response("File Lost", { status: 404 });
      }
      return addCORSHeaders(
        new Response(Bun.file(`storage/${id}`), {
          headers: {
            "Content-Disposition": `attachment; filename="${encodeURIComponent(
              fileName,
            )}"`,
          },
        }),
      );
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at port ${server.port}`);
