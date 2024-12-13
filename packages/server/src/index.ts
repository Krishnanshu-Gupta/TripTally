import express, { Request, Response } from "express";
import Experiences from "./services/experience-svc";
import { ExperiencePage } from "./pages/experience";
import experiences from "./routes/experiences";
import reviews from "./routes/reviews";
import Reviews from "./services/review-svc";
import Save from "./services/save-svc";
import saved from "./routes/saved";

import { connect } from "./services/mongo";
import auth from "./routes/auth";
import { LoginPage, RegistrationPage, renderPage } from "./pages/index";
import fs from "fs/promises";
import path from "path";

connect("experience");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/auth", auth);
app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(renderPage(LoginPage.render()));
});

app.get("/register", (req: Request, res: Response) => {
  const page = new RegistrationPage();
  res
    .set("Content-Type", "text/html")
    .send(renderPage(RegistrationPage.render()));
});

app.use("/app", (req, res) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" })
    .then((html) => res.send(html))
    .catch((err) => {
      console.error("Error reading index.html:", err);
      res.status(500).send("Server error");
    });
});

app.use("/api/experiences", experiences);
app.use("/api/reviews", reviews);
app.use("/api/saved", saved);

app.get("/experience/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await Experiences.getExperience(id);
    if (!data) {
      res.status(404).send("Experience not found");
      return;
    }

    const page = new ExperiencePage(data);
    res.set("Content-Type", "text/html").send(page.render());
  } catch (error) {
    console.error("Error rendering experience page:", error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {});
