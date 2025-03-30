import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  // out: "./drizzle",
  // driver: "pglite",
  dbCredentials: {
    // Use "url" here as Drizzle expects:
    url: 'postgresql://neondb_owner:npg_w38ZYdhzISmL@ep-lingering-salad-a8l51swm-pooler.eastus2.azure.neon.tech/ai-study-material?sslmode=require',
  },
});




// dotenv.config(); // Load environment variables

// export default defineConfig({
//   dialect: "pg",  
//   driver: "pg",
//   schema: "./configs/schema.js",
//   out: "./drizzle",
//   dbCredentials: {
//     // connectionString: process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING,
//     connectionString: "postgresql://neondb_owner:npg_w38ZYdhzISmL@ep-lingering-salad-a8l51swm-pooler.eastus2.azure.neon.tech/ai-study-material?sslmode=require",
//   },
// });
