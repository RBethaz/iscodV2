const Article = require("./articles.schema");

class ArticlesService {
  create(articleData, userId) {
    const article = new Article({ ...articleData, user: userId });
    return article.save();
  }

  update(articleId, articleData) {
    return Article.findByIdAndUpdate(articleId, articleData, { new: true });
  }

  delete(articleId) {
    return Article.findByIdAndDelete(articleId);
  }
  async getUserArticles(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
  async getUserArticles(userId) {
    try {
      const articles = await Article.find({ user: userId }).populate(
        "user",
        "name email"
      );
      return articles;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des articles de l'utilisateur : ",
        error
      );
    }
  }
}

module.exports = new ArticlesService();
