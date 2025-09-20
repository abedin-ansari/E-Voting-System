const neo4j = require("neo4j-driver");

// Connect to the Neo4j Aura instance
const driver = neo4j.driver(
  "neo4j+s://97a7f9ef.databases.neo4j.io", // Replace with your NEO4J_URI
  neo4j.auth.basic("neo4j", "KfZOfmncBBbH8QAX9Mh8RsPna7RyBwfuy1Bgk-kJCTs") // Replace with your NEO4J_USERNAME and NEO4J_PASSWORD
);

const session = driver.session();

module.exports = { driver, session };
