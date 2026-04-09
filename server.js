import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

// ================== DATA ==================
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content: "DeFi is changing finance...",
    author: "Alex Thompson",
    date: new Date(),
  },
];

let lastId = 1;

// ================== FRONTEND ROUTES ==================

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  res.render("modify.ejs", {
    heading: "Edit Post",
    submit: "Update Post",
    post,
  });
});

// ================== API ROUTES ==================

app.post("/api/posts", (req, res) => {
  const newId = ++lastId;

  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };

  posts.push(post);
  res.redirect("/");
});

app.post("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.redirect("/");
});

app.get("/api/posts/delete/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  posts.splice(index, 1);
  res.redirect("/");
});

// ================== SERVER ==================

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});