import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: [
    "/styles/reset.css",
    "/styles/tokens.css",
    "/styles/page.css",
  ],
  googleFontURL:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&display=swap",
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}
