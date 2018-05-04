const express = require("express"),
  app = express(),
  BP = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/my_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(BP.urlencoded({ extended: true }));

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  createdDate: { type: Date, default: Date.now }
});
let Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) console.log(`Error: ${err}`);
    res.render("index", { blogs });
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, fn) => {
    if (err) {
      res.render("new");
    }
    res.redirect("/blogs");
  });
});
app.listen(3030, () => {
  console.log("Listening at port 3030");
});
