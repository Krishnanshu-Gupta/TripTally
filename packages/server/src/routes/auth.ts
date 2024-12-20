import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else {
          resolve(token as string);
        }
      }
    );
  });
}

router.post("/register", (req: Request, res: Response) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials.create(username, name, password).then((creds) =>
      generateAccessToken(creds.username)
        .then((token) => ({
          token,
          id: creds._id,
          username: creds.username,
          name: creds.name,
        }))
        .then((response) => {
          res.status(201).send(response);
        })
    );
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((creds) =>
        generateAccessToken(creds.username).then((token) => ({
          token,
          id: creds._id,
          username: creds.username,
          name: creds.name,
        }))
      )
      .then((response) => res.status(200).send(response))
      .catch(() => res.status(401).send("Unauthorized"));
  }
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (_, decoded) => {
      if (decoded) {
        next();
      } else {
        res.status(401).end();
      }
    });
  }
}

export default router;
