const request = require("supertest");
const { app } = require("../server"); // Assurez-vous que le chemin d'accès est correct
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema"); // Assurez-vous que le chemin d'accès est correct
const articlesService = require("../api/articles/articles.service");

describe("Articles API endpoints", () => {
  let token;
  const ARTICLE_ID = "some-article-id";
  const USER_ID = "some-user-id";
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Test content",
    status: "draft",
    user: USER_ID,
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);

    mockingoose(Article).reset();
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn(null, "findOneAndDelete");
  });

  test("Create article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("x-access-token", token)
      .send({
        title: "Test Article",
        content: "Test content",
        status: "draft",
        user: USER_ID,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
  });

  test("Update article", async () => {
    const updatedContent = "Updated content";
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token)
      .send({ ...MOCK_ARTICLE, content: updatedContent });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe(MOCK_ARTICLE.content);
  });

  test("Delete article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
