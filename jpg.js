require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const inputPath = "./laars.jpg";
const formData = new FormData();
formData.append("size", "auto");
formData.append("image_file", fs.createReadStream(inputPath), path.basename(inputPath));
formData.append("bg_color", "fff");

axios({
  method: "post",
  url: "https://api.remove.bg/v1.0/removebg",
  data: formData,
  responseType: "arraybuffer",
  headers: {
    ...formData.getHeaders(),
    "X-Api-Key": process.env.API_KEY,
    format: "jpg",
  },
  encoding: null,
})
  .then((response) => {
    if (response.status != 200) return console.error("Error:", response.status, response.statusText);
    fs.writeFileSync("no-bg.jpg", response.data);
  })
  .catch((error) => {
    return console.error("Request failed:", error);
  });
