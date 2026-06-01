import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split("=")),
);
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_API_KEY);
const tableName = process.argv[2] || "detalle_ventas";
const main = async () => {
  const { data, error } = await supabase.from(tableName).select("*").limit(1);
  console.log("table", tableName);
  console.log("data", data);
  console.log("error", error);
};
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
