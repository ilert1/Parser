import playwright from "playwright";
import express from "express";
import cors from "cors";

const app = express();
const port = 3001;
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
app.get("/", async (req, res) => {
    let query = req.query.que;

    try {
        let m = await main(query);
        res.send(m);
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

async function main(query) {
    const browser = await playwright.chromium.launch({
        headless: true, // setting this to true will not run the UI
    });

    const page = await browser.newPage();

    await page.goto(
        `https://www.wildberries.ru/catalog/0/search.aspx?search=${query}`
    );

    const node = page.locator(".dropdown-filter__btn", {
        hasText: "Бренд",
    });
    await node.click();

    await page.locator(".filter__show-all").click();

    await page.waitForSelector(
        ".filter__input-search.input-search.input-search--gray"
    );

    let m = await page
        .locator(".dropdown-filter.open ul")
        .evaluate(async (node) => {
            const delay = (ms) =>
                new Promise((resolve) => setTimeout(resolve, ms));

            let mass = new Set();
            while (node.offsetHeight + node.scrollTop < node.scrollHeight) {
                let names = node.querySelectorAll(".checkbox-with-text__text");
                names.forEach((e) => mass.add(e.childNodes[0].textContent));
                node.scrollTo(0, node.scrollHeight);
                await delay(100);
            }

            let res = Array.from(mass);
            console.log(res);
            return res;
        });
    await browser.close();
    return m;
}
