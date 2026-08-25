import app from "./src/app.js";
import "dotenv/config";
import connectToDB from "./src/config/db.js";

connectToDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});