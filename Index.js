require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

//joining path of directory
const directoryPath = path.join(__dirname, "images");
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  //   console.log(__dirname);
  //listing all files using forEach
  files.forEach(function (file) {
    let inputPath = path.join(`${__dirname}/images/${file}`);
    let formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", fs.createReadStream(inputPath), path.basename(inputPath));

    axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": process.env.API_KEY,
      },
      encoding: null,
    })
      .then((response) => {
        if (response.status != 200) return console.error("Error:", response.status, response.statusText);
        let outputName = path.join(`${__dirname}/output/${file}`);
        fs.writeFileSync(outputName, response.data);
      })
      .catch((error) => {
        return console.error("Request failed:", error);
      });

    // Do whatever you want to do with the file
    console.log(file);
  });
});
