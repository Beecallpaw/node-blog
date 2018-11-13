const express = require("express"),
  app = express(),
  sanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  BP = require("body-parser"),
  mongoose = require("mongoose"),
  port = process.env.PORT || 3000;

mongoose.connect("mongodb://admin:admin123@ds137913.mlab.com:37913/my_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(BP.urlencoded({ extended: true }));
app.use(sanitizer());
app.use(methodOverride("_method"));

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
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, fn) => {
    if (err) {
      res.render("new");
    }
    res.redirect("/blogs");
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, data) => {
    if (err) {
      res.redirect("/blogs");
    }
    res.render("show", { blog: data });
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, data) => {
    if (err) {
      res.redirect("/");
    }
    res.render("edit", { blog: data });
  });
});

app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, data) => {
    if (err) {
      res.redirect("/");
    }
    res.redirect("/blogs/" + req.params.id);
  });
});

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/blogs");
    }
    res.redirect("/blogs");
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
