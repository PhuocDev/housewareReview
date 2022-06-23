const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const moment = require("moment");
const cron = require("node-cron");
const Coupon = require("../app/models/Coupon");
const NodeCache = require("node-cache");

const couponsCache = new NodeCache({ stdTTL: 120 });

const PROVIDERS = {
  TIKI: {
    source: "tiki",
    url: "https://mgg.vn/ma-giam-gia/tiki-vn/",
  },
  SHOPEE: {
    source: "shopee",
    url: "https://mgg.vn/ma-giam-gia/shopee/",
  },
  LAZADA: {
    source: "lazada",
    url: "https://mgg.vn/ma-giam-gia/lazada/",
  },
};

const fetchCoupons = async (provider) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(provider.url);

    let content = await page.content();
    const $ = cheerio.load(content);

    $(".coupon-item").each(function (_, element) {
      const id = $(element).attr("data-id");

      if (!couponsCache.has(id)) {
        const newCoupon = new Coupon({
          id,
          title: $(element).find(".coupon-title").text().trim(),
          value: $(element).find(".store-thumb").text().trim(),
          code: $(element).find(".code-text").text().trim(),
          description: $(element).find(".reveal-content").text().trim(),
          url: $(element).find(".coupon-title a").attr("data-aff-url"),
          source: provider.source,
          expiredDate: moment(
            $(element).find(".exp").text().trim().split(" ")[2],
            "DD/MM/YYYY"
          ).toDate(),
        });

        newCoupon.save().then((result) => {
          console.log(`Fetched coupon with id=${id}`);
          couponsCache.set(id, true);
        });
      } else {
        console.log(`Has coupon with id=${id}`);
      }
    });
  } catch (error) {
    console.log(`Cron error for provider ${provider.source}:`, error);
  }
};

const startCrons = async () => {
  cron.schedule("*/5 * * * *", () => {
    fetchCoupons(PROVIDERS.TIKI);
  });

  cron.schedule("*/7 * * * *", () => {
    fetchCoupons(PROVIDERS.SHOPEE);
  });

  cron.schedule("*/9 * * * *", () => {
    fetchCoupons(PROVIDERS.LAZADA);
  });
};

module.exports = {
  startCrons,
};
