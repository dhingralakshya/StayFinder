const express = require("express");
const router = express.Router();
const ImageKit = require("imagekit");
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

router.get("/auth", (req, res) => {
  res.send(imagekit.getAuthenticationParameters());
});

module.exports = router;
