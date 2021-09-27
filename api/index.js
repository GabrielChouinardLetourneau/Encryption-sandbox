const express = require("express");
require('dotenv').config()
const app = express();  //Create new instance
const PORT = process.env.PORT || 8888; //Declare the port number
const cors = require("cors")
const helmet = require("helmet");
const crypto  = require("crypto").webcrypto;
const session = require("express-session");
const decrypt = require('./utils.js');

app.use(cors())
app.use(express.json());
app.use(helmet());

const mockUser = {
  username: process.env.MOCK_USER_NAME,
  pw: process.env.MOCK_USER_PW
}

const salt = crypto.getRandomValues(new Uint8Array(16))

const sessionMiddleware = session({
  secret: process.env.SECRET_DEFAULT,
  saveUninitialized:true,
  cookie: { 
    maxAge:  1000 * 60 * 60 * 24,
  },
  resave: false 
});
app.use(sessionMiddleware);


app.use("/login", function (req, res, next) {
  const { username, password } = req.body
  if (password !== mockUser.pw && username !== mockUser.username) {  
    res.status(401).json({})
    return
  }
  next()
})


// Add sub-routes
app.post("/user/login", 
  async (req, res, next) => {
    const { username, password } = req.body
    const buffedPw = Buffer.from([password])

    const key = await crypto.subtle.importKey(
      "raw", 
      buffedPw,
      {
          name: "PBKDF2",
      },
      false, 
      ["deriveKey"] 
    )
    .then(function(importedKey){
      return crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 1000,
          hash: { name: "SHA-512" }
        }, 
        importedKey,
        {
            name: "HMAC",
            hash: "SHA-512",
            length: 512
        },
        true,
        ["sign"]
      )
    })
    .catch(function(err){
       return err;
    });

    const encodedKey = Buffer.from(JSON.stringify(key)).toString("base64")

    req.session.username = username;
    req.session.key = encodedKey;
    req.session.save();

    res.status(200).send({});
    return
  }
);

app.post("/user/encrypt-infos", async (req, res) => {
  const { infos } = req.body
  const buffedInfos = Buffer.from(infos)

  const buffedKey = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    false,
    ["encrypt", "decrypt"] 
  )
  .then(async function(key){
    const encryptedKey = await crypto.subtle.encrypt({ 
      name: "AES-GCM", 
      iv: crypto.getRandomValues(new Uint8Array(12)),
      tagLength: 128, 
    }, key, buffedInfos)

    return encryptedKey
  })
  .catch(function(err){
    console.error(err);
  });

  const encoded = Buffer.from(buffedKey).toString("base64")
  res.status(200).send({ key: encoded })
  return
});

app.post("/user/decrypt-infos", async (req, res) => {
  const { key } = req.body
  const buffedInfos = Buffer.from(key, "base64")
  const algDecrypt = {
    name: "AES-GCM",
    iv: crypto.getRandomValues(new Uint8Array(12)), 
    tagLength: 128, 
  }
  
  const decryptedInfos = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256, 
    },
    false, 
    ["encrypt", "decrypt"] 
  )
  .then(async function(key){
    const decrypted = await decrypt(algDecrypt, key, buffedInfos)
    console.log(decrypted);
  })
  .catch(function(err){
    throw new Error(err)
  });
  res.status(200).send({ infos: decryptedInfos });
  return
});

//Define the endpoint
app.get("/ping", (req, res) => {  
  return res.send({
    status: "Healthy",
  });
});
app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});