const express = require("express");
require("dotenv").config()
const app = express();
const PORT = process.env.PORT || 8888; 
const cors = require("cors")
const helmet = require("helmet");
const crypto  = require("crypto").webcrypto;
const decrypt = require("./utils.js");

app.use(cors())
app.use(express.json());
app.use(helmet());

const mockUsers = 
  [
    {
      id: "f9beba28-8d3a-4e0a-9efe-0768f42e362e",
      username: "root",
      pw: "root"
    },
    {
      id: "ecf48458-7833-45e1-8f48-744fcbdbc6be",
      username: "GCL",
      pw: "nU8TyK7@^EQW"
    },
    {
      id: "275348ca-b5bb-40d1-9370-acb47264c53a",
      username: "admin@logmein.com",
      pw: "AYPpSndfom$A"
    },
  ]


const salt = crypto.getRandomValues(new Uint8Array(16))

function authMiddleware(req, res, next) {
  try {
    const { username } = req.body

    if (!mockUsers.find(usr => usr.username === username)) {
      res.status(401).json({});
    } else {
      next();
    }
  } catch {
    res.status(401).json({});
  }
}

// Add sub-routes
app.post("/user/login", 
  authMiddleware, 
  async (req, res, next) => {
    const { username, password } = req.body
    console.log(username, password);
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

    res.status(200).send({ 
      username: username, userKey: encodedKey 
    });
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
    // Source of Cipher job failed
    const decrypted = await decrypt(algDecrypt, key, buffedInfos)
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