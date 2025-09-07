const express = require("express");
const bodyParser = require("body-parser");
const { chromium } = require("playwright");

const app = express();
app.use(bodyParser.json());

app.post("/submit", async (req, res) => {
  const { problemUrl, solution } = req.body;

  if (!problemUrl || !solution) {
    return res.status(400).json({ error: "Missing problemUrl or solution" });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Login
    await page.goto("https://leetcode.com/accounts/login/");
    await page.fill('input[name="login"]', process.env.LC_USERNAME);
    await page.fill('input[name="password"]', process.env.LC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    // Open problem
    await page.goto(problemUrl);

    // Select Python3
    await page.click('text=Python3');

    // Insert solution
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await page.keyboard.type(solution);

    // Submit
    await page.click('button:has-text("Submit")');
    await page.waitForSelector('text=Accepted, text=Wrong Answer, text=Runtime Error', { timeout: 60000 });

    const result = await page.content();
    await browser.close();

    res.json({ status: "submitted", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Important: use Railway's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
