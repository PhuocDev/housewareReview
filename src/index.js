const path = require("path");
const express = require("express");
const morgan = require("morgan");
const exphandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const route = require("./routes");
const connectDB = require("./config/connectDb");
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000;
const moment = require("moment");
const { startCrons } = require("./crons/coupons.cron");
const { startBestsellerCrons } = require("./crons/bestsellers.cron");
const paginate = require("handlebars-paginate");

app.use(express.static("public"));
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { ExpressHandlebars } = require("express-handlebars");

//middlewares
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: null } }));

//flash message middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  delete req.session.message;
  next();
});

// Connect mongoDb
connectDB();

// Moment
// https://stackoverflow.com/questions/38367038/format-relative-time-in-momentjs
moment.updateLocale("en", {
  relativeTime: {
    future: "trong %s",
    past: "%s trước",
    s: function (number, withoutSuffix, key, isFuture) {
      return "00:" + (number < 10 ? "0" : "") + number + " phút";
    },
    m: "01:00 phút",
    mm: function (number, withoutSuffix, key, isFuture) {
      return (number < 10 ? "0" : "") + number + " phút";
    },
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(morgan('combine'));
// Template engine
app.engine(
  "hbs",
  exphandlebars({
    extname: ".hbs",
    // handlebars: allowInsecurePrototypeAccess(exphandlebars)
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// register handlebars function
var hbs = exphandlebars.create({});
hbs.handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
hbs.handlebars.registerHelper("toDateTimeString", function (datetime) {
  var datetimeString =
    datetime.toDateString() + " " + datetime.toTimeString().substring(0, 5);
  return datetimeString;
});
hbs.handlebars.registerHelper("formatDate", function (datetime) {
  // const previousDate = moment().subtract(1, "days");

  return moment(datetime).fromNow();

  // if (moment(datetime).isAfter(previousDate)) {
  //   return moment(datetime).fromNow();
  // } else {
  //   return moment(datetime).format("DD/MM/YYYY, HH:mm");
  // }
});
hbs.handlebars.registerHelper("truncateText", function (str, len) {
  if (str.length > len) {
    return str.slice(0, len) + "...";
  } else {
    return str;
  }
});
hbs.handlebars.registerHelper("paginate", paginate);

//route init
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  //startCouponCrons();
  
  //startBestsellerCrons();
  //startCrons();
});
