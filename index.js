const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 8000;
const User = require("./User");
require("./Config");
const Faculty = require("./Faculty");
const Student = require("./Student");

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./studentimg");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload1 = multer({ storage: storage1 });

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/fac", upload.single("img"), async (req, res) => {
  const { name, email, phone, age, experience, address } = req.body;
  const img = req.file ? req.file.filename : null;
  const faculty = new Faculty(req.body);
  const result = await faculty.save();
  if (result) {
    res.send(
      '<script>alert("registerd"); window.location.assign("/sidebar") </script>'
    );
  }
});

app.post("/addstud", upload1.single("img"), async (req, res) => {
  const { name, email, phone, age, experience, address } = req.body;
  const img = req.file ? req.file.filename : null;
  const student = new Student(req.body);
  const result = await student.save();
  if (result) {
    res.send(
      '<script>alert("registerd"); window.location.assign("/sidebar") </script>'
    );
  }
});

app.post("/login", async (req, resp) => {
  if (req.body.email && req.body.password) {
    let result = await User.findOne(req.body).select("-password");
    if (result) {
      resp.redirect("/sidebar");
    } else {
      resp.send({ result: "Invalid Credentials" });
    }
  } else {
    resp.send({ result: "Both fields are mandatory" });
  }
});

app.get("/sidebar", (req, res) => {
  res.render("Sidebar");
});

app.get("/HomePage.ejs", (req, res) => {
  res.render("HomePage");
});

app.get("/AddStudent.ejs", (req, res) => {
  res.render("AddStudent");
});
//   app.get('/FacDisp.ejs', (req, res) => {
//     res.render('FacDisp');
//   });

app.get("/faculty", async (req, res) => {
  try {
    const facultyList = await Faculty.find();
    res.render("FacDisp", { facultyList: facultyList });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
