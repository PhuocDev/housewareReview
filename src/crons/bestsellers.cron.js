const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const moment = require("moment");
const cron = require("node-cron");
const NodeCache = require("node-cache");
const Bestseller = require("../app/models/Bestseller");

const CATEGORIES = [
  {
    category: "beauty",
    id: "c30264",
    slug: "top-san-pham-ban-chay-nhat",
  },
  {
    category: "digital_devices",
    id: "c21398",
    slug: "do-choi-cong-nghe",
  },
  {
    category: "electric_appliances",
    id: "c1882",
    slug: "dien-gia-dung",
  },
];

const getYears = () => {
  let currentYear = new Date().getFullYear();

  let results = [];

  do {
    currentYear = currentYear - 1;

    results.push({
      unit: "year",
      value: currentYear,
    });
  } while (currentYear !== 2019);

  return results;
};

const createUrl = (period, category, page = 1) => {
  switch (period?.unit) {
    case "week":
      return `https://tiki.vn/bestsellers/${category?.slug}/${category?.id}?p=${page}`;

    case "month":
      return `https://tiki.vn/bestsellers-month/${category?.slug}/${category?.id}?p=${page}`;

    case "year":
      return `https://tiki.vn/bestsellers-${period?.value}/${category?.slug}/${category?.id}?p=${page}`;
  }
};

const fetchItems = async (period, category, page) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(createUrl(period, category));

    let content = await page.content();
    const $ = cheerio.load(content);

    const errorBannerText = $(".error404-banner").text();

    if (errorBannerText !== "") {
      return;
    }

    let totalPages = $(".bestseller-cat > .bestseller-nav")
      .first()
      .find(".bestseller-pager")
      .children().length;
    let $$$ = $;
    let items = [];

    if (totalPages === 0) {
      totalPages = 1;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i > 1) {
        await page.goto(createUrl(period, category, i));

        let pageContent = await page.content();
        const $$ = cheerio.load(pageContent);

        $$$ = $$;
      } else {
        $$$ = $;
      }

      const alert = $$$(".alert-warning").text();

      if (alert === "") {
        $$$(".bestseller-cat-item").each(async function (_, element) {
          const id = $$$(element).attr("data-id");
          const rank = parseInt($$$(element).find(".number").text().trim());

          const newItem = {
            id,
            rank,
            category: category?.category,
            title: $$$(element).find(".title").text().trim(),
            review_count:
              parseInt(
                $$$(element)
                  .find(".review")
                  .text()
                  .trim()
                  .split(" ")[0]
                  .replace("(", "")
              ) || 0,
            sale_price: $$$(element)
              .find(".price-sale")
              .text()
              .trim()
              .split(" ")[0],
            regular_price: $$$(element).find(".price-regular").text().trim(),
            discount_rate: $$$(element).find(".sale-tag").text().trim(),
            url: $$$(element).find(".description a").attr("href"),
            period:
              period?.unit !== "year"
                ? period?.unit
                : `${period?.unit}_${period?.value}`,
            image: $$$(element).find(".image img").attr("src"),
          };

          items.push(newItem);
        });
      } else {
        break;
      }
    }

    for (let i = 0; i < items?.length; i++) {
      Bestseller.findOneAndUpdate(
        {
          id: items[i].id,
          category: items[i].category,
          rank: items[i].rank,
          period: items[i].period,
        },
        items[i],
        { upsert: true },
        function (err, doc) {
          if (err) {
            console.log(`Cron error for category ${items[i].category}:`, err);
          } else {
            console.log(`Fetched coupon with id=${items[i].id}`);
          }
        }
      );
    }
  } catch (error) {
    console.log(
      `Cron error for bestseller category ${category?.category}:`,
      error
    );
  }
};

const startBestsellerCrons = async () => {
  const years = [2020, 2019];

  for (let i = 0; i < CATEGORIES.length; i++) {
    cron.schedule("0 0 * * SUN", async () => {
    await fetchItems(
      {
        unit: "week",
      },
      CATEGORIES[i]
    );
     });
  }

  for (let i = 0; i < CATEGORIES.length; i++) {
     cron.schedule("0 0 1 * *", async () => {
    await fetchItems(
      {
        unit: "month",
      },
      CATEGORIES[i]
    );
     });
  }

  for (let i = 0; i < years.length; i++) {
    for (let j = 0; j < CATEGORIES.length; j++) {
       cron.schedule("0 0 1 1 *", async () => {
      await fetchItems(
        {
          unit: "year",
          value: years[i],
        },
        CATEGORIES[i]
      );
       });
    }
  }
};

module.exports = {
  startBestsellerCrons,
};
