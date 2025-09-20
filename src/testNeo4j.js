const { session, driver } = require("./db");

async function testConnection() {
  try {
    const result = await session.run(
      'RETURN "Neo4j Connection Successful" AS message'
    );
    console.log(result.records[0].get("message"));
  } catch (error) {
    console.error("Error connecting to Neo4j:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

testConnection();
