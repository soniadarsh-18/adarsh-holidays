//

const bcrypt = require("bcrypt");

async function generatePassword() {
  const password = "admin123"; // Change to your desired password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

generatePassword();
