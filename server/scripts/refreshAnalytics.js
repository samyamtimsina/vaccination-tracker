import { execSync } from "child_process";
import path from "path";

const DATABASE_URL = (process.env.DATABASE_URL || "postgresql://vaccination_user:vaccination123@localhost:5432/vaccination_db").split("?")[0];


function runSql(file) {
    console.log(`➡️ Running ${file}...`);
    execSync(`psql "${DATABASE_URL}" -f "${file}"`, { stdio: "inherit" });
}

async function main() {
    try {
        const base = path.join(process.cwd(), "sql");
        runSql(path.join(base, "refresh_child_analytics.sql"));
        runSql(path.join(base, "refresh_mother_analytics.sql"));
        runSql(path.join(base, "refresh_growth_analytics.sql"));
        console.log("✅ Analytics refresh complete!");
    } catch (e) {
        console.error("❌ Refresh failed:", e);
        process.exit(1);
    }
}

main();
