import express, { Request, Response } from "express";
import Experiences from "./services/experience-svc";
import { ExperiencePage } from "./pages/experience";
import experiences from "./routes/experiences";
import { connect } from "./services/mongo";

connect("experience");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/experiences", experiences);

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
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

