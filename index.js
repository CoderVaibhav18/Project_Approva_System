const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { student } = require("./models/student");
const { hod } = require("./models/hod");
const { project } = require("./models/project");
const dotenv = require("dotenv");


dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongodb connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get("/", (req, res) => {
  return res.render("Home");
});

// for students routing
app.get("/student/signup", (req, res) => {
  return res.render("StudentSignup");
});

app.post("/student/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await student.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ email, password }, process.env.STUDENT_SCRETE_KEY);
  res.cookie("token", token);
  // res.send("User Created")
  return res.redirect("/student/login");
});

app.get("/student/login", (req, res) => {
  return res.render("StudentLogin");
});

app.post("/student/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await student.findOne({ email });
  if (!user)
    return res.render("StudentLogin", { error: "Invalid username or password" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) res.send("incorrect");
    res.render("StudentLanding", { studentName: user.name });
  });
});

app.get("/student/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

// for hod routing
app.get("/hod/signup", (req, res) => {
  res.render("HodSignup");
});

app.get("/hod/login", (req, res) => {
  res.render("HodLogin");
});

app.post("/hod/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await hod.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log(user);

  const token = jwt.sign({ email, password }, process.env.HOD_SCRETE_KEY);
  res.cookie("token", token);
  // res.send("User Created")
  return res.redirect("/hod/login");
});

app.post("/hod/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await hod.findOne({ email });
  console.log(user);

  if (!user)
    return res.render("login", { error: "Invalid username or password" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) res.render("Hodlogin",{error: 'invalid password or email'});
    res.render("HodLanding", { hodName: user.name });
  });
});

app.get("/hod/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/hod/login");
});

app.get("/hod/dashboard", (req, res) => {
  res.render("HodDashboard");
});

// for projects
app.get("/student/Approval", (req, res) => {
  res.render("StudentApproval");
});

app.post("/student/Approval", async (req, res) => {
  const { member1, member2, member3, member4, title, description } = req.body;

  const projectDetails = await project.create({
    groupMembers: [member1, member2, member3, member4],
    ProjectTitle: title,
    description: description,
  });
  console.log(projectDetails);
});

app.get("/hod/approval", async (req, res) => {
  const projects = await project.find({});
  let a = 0;
  console.log(projects);
  return res.render("HodApproval", { allProjects: projects, a });
});

app.patch("/api/projects/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const Project = await project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!Project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Notify students (implement your own notification logic)
    // For now, just log it
    console.log(
      `Notification sent to team: ${Project.groupMembers.join(
        ", "
      )} for status: ${status}`
    );

    res.json({ message: `Project ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// for notification
app.get("/student/notification", (req, res) => {
  res.render("StudentNotification")
})

const port = process.env.PORT || 5544;

app.listen(port, () => {
  console.log(`Server has started at port: ${port}`);
});
