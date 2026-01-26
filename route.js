// scripts/route-list.js
import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "app"); // ganti ke "pages" kalau pake Pages Router
const routes = [];

function walk(dir, base = "") {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, path.join(base, file));
    }

    if (file === "page.tsx" || file === "page.jsx") {
      const route =
        "/" +
        base
          .replace(/\\/g, "/")
          .replace(/^\//, "")
          .replace(/\/page$/, "");
      routes.push(route === "/" ? "/" : route);
    }

    if (file === "route.ts" || file === "route.js") {
      const apiRoute =
        "/api/" +
        base
          .replace(/\\/g, "/")
          .replace(/^\//, "")
          .replace(/\/route$/, "");
      routes.push(apiRoute);
    }
  }
}

walk(APP_DIR);

console.log("=== ROUTE LIST ===");
routes.sort().forEach(r => console.log(r));
