const node_crypto = require("crypto");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const Base64 = require("crypto-js/enc-base64");

const fileContent_encrypter = (fileContent, privateKey) => {
  const algo = "aes-256-ctr";
  const secretKey = node_crypto
    .createHash("sha256")
    .update(String(privateKey))
    .digest("base64")
    .substring(0, 32);

  var cipher, result, iv;
  iv = node_crypto.randomBytes(16);
  cipher = node_crypto.createCipheriv(algo, secretKey, iv);
  result = Buffer.concat([iv, cipher.update(fileContent), cipher.final()]);
  return result;
};

const fileContent_decrypter = (encryptedFileContent, privateKey) => {
  const algo = "aes-256-ctr";
  const secretKey = node_crypto
    .createHash("sha256")
    .update(String(privateKey))
    .digest("base64")
    .substring(0, 32);
  var decipher, result, iv;

  iv = encryptedFileContent.slice(0, 16);

  encryptedFileContent = encryptedFileContent.slice(16);

  decipher = node_crypto.createDecipheriv(algo, secretKey, iv);
  result = Buffer.concat([decipher.update(encryptedFileContent), decipher.final()]);

  return result;
};

const fileEncryptor = (sourceFile, destinationFile, privateKey, flag = null, callback) => {
  if (fs.existsSync(destinationFile) && flag != "r") {
    callback(
      null,
      "the file already exists! if you want to overwrite it pass 'r' into flag parameter.",
    );
    return;
  }

  fs.readFile(sourceFile, (err, file) => {
    if (err) {
      callback(null, err.message);
      return;
    }

    const encryptedFileContent = fileContent_encrypter(file, privateKey);

    fs.writeFile(destinationFile, encryptedFileContent, (err, file) => {
      if (err) {
        callback(null, err.message);
        return;
      }

      callback("Encrypted Successfully!", null);
      return;
    });
  });
};

const fileDecryptor = (filePath, destinationPath = null, privateKey, callback) => {
  if (!fs.existsSync(filePath)) {
    callback(null, "No such a file in this giver path: " + filePath);
    return;
  }

  fs.readFile(filePath, (err, file) => {
    if (err) {
      callback(null, err.message);
      return;
    }
    let decryptedFileContent = fileContent_decrypter(file, privateKey);

    if (destinationPath) {
      let file = filePath.split(".");
      let extension = file[1];

      if (extension.toLowerCase() === "json") {
        decryptedFileContent = JSON.stringify(decryptedFileContent, null, 2);
      }

      fs.writeFile(destinationPath, decryptedFileContent, (err, file) => {
        if (err) {
          callback(null, err.message);
          return;
        }

        callback("Decrypted Successfully!", null);
        return;
      });
    } else {
      callback(decryptedFileContent.toString("utf-8"), null);
      return;
    }
  });
};

const keyEncryptor = (key, privateKey) => {
  const secretKey = node_crypto
    .createHash("sha256")
    .update(String(privateKey))
    .digest("base64")
    .substring(0, 32);

  let encJson = CryptoJS.AES.encrypt(JSON.stringify(key), secretKey).toString();
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
  return encData;
};
const keyDecryptor = (encrypted, privateKey) => {
  const secretKey = node_crypto
    .createHash("sha256")
    .update(String(privateKey))
    .digest("base64")
    .substring(0, 32);

  let decData = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
  let bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(CryptoJS.enc.Utf8);
  return JSON.parse(bytes);
};

const HashKey = (key, privateKey) => {
  return Base64.stringify(CryptoJS.HmacSHA512(key, privateKey));
};

module.exports = {
  fileEncryptor,
  fileDecryptor,
  fileContent_encrypter,
  fileContent_decrypter,
  keyEncryptor,
  keyDecryptor,
  HashKey,
};
