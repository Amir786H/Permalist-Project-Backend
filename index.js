import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

/* This code snippet is establishing a connection to a PostgreSQL database using the `pg` library in a
Node.js application. Here's a breakdown of what each part is doing: */
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "2424",
  port: 5432,
});
db.connect();

/* `app.use(bodyParser.urlencoded({ extended: true }));` is setting up middleware in the Express
application to parse incoming request bodies in URL-encoded format. The `bodyParser.urlencoded({
extended: true })` middleware parses the incoming request data and makes it available in `req.body`
object. The `extended: true` option allows for parsing of nested objects in the URL-encoded data.
This middleware is commonly used to handle form submissions where the form data is sent in the body
of the request in URL-encoded format. */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

/* This code snippet is defining a route handler for a GET request to the root URL ("/"). When a user
accesses the root URL of the application, this handler function is executed. Here's a breakdown of
what it does: */
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
    console.log("Items:::::", items);

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    /* The line `await db.query("UPDATE items SET title = () WHERE id = ", [item, id]);` is
    updating a record in the `items` table of the PostgreSQL database. */
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
