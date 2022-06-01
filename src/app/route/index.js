const homeRouter = require("./home");
const loginRouter = require("./login");
const signupRouter = require("./signup");
const authRouter = require("./auth");
const accountRouter = require("./account");
const serviceRouter = require("./service");
const contactRouter = require("./contact");
const bookRouter = require("./book");
const blogRouter = require("./blog");
const couponRouter = require("./coupon");
const historyRouter = require("./history");
const bestsellerRouter = require("./bestseller");
const searchRouter = require("./search");
const { requireAuth, checkUser } = require("../app/middleware/AuthMiddleware");

function route(app) {
  app.get("*", checkUser);
  app.get("/", (req, res) => {
    res.redirect("/home");
  });
  // app.use("/", homeRouter);
  app.use("/home", homeRouter);
  app.use("/account", accountRouter);
  app.use("/service", serviceRouter);
  app.use("/contact", contactRouter);
  app.use("/blog", checkUser, blogRouter);
  app.use("/bestsellers", bestsellerRouter);
  app.use("/coupons", checkUser, couponRouter);
  app.use("/histories", historyRouter);
  app.use("/search", searchRouter);
  app.use("/", authRouter);
}

module.exports = route;
