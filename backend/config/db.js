const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres.xogjqovzwtmmjsfhofpi",
  host: "aws-0-ap-south-1.pooler.supabase.com",
  database: "postgres",
  password: "ansariafroz",
  port: 5432,
});

pool.query("SELECT 1", (err, result) => {
  if (err) {
    console.error("Error executing query:", err);
  } else {
    console.log("Connected to the PostgreSQL server");
  }
});

module.exports = pool;
