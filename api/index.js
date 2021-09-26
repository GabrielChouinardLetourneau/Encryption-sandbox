const express = require("express");
const app = express();  //Create new instance
const PORT = process.env.PORT || 8888; //Declare the port number
const cors = require("cors")
const helmet = require("helmet");
const crypto  = require("crypto").webcrypto;
const session = require('express-session');

app.use(cors())
app.use(express.json());
app.use(helmet());

const mockUser = {
  username: "GCL",
  pw: "root"
}

const salt = crypto.getRandomValues(new Uint8Array(16))

app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { 
    maxAge:  1000 * 60 * 60 * 24,
  },
  resave: false 
}));

// app.use(express.session({ secret: "keyboard cat" }));
// app.use(passport.session());


app.use("/login", function (req, res, next) {
  const { username, password } = req.body
  if (password !== mockUser.pw && username !== mockUser.username) {  
    res.status(401).json({})
    return
  }
  next()
})


// Add sub-routes
app.post("/login", 
  async (req, res) => {
    const { username, password } = req.body
    req.session.username = username;

    const buffedPw = Buffer.from([password])

    const key = await crypto.subtle.importKey(
      "raw", //only "raw" is allowed
      buffedPw, //your password
      {
          name: "PBKDF2",
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["deriveKey"] //can be any combination of "deriveKey" and "deriveBits"
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
        console.error("importKey err-----", err);
    });
    console.log("importKey res-----", key);
    req.session.key = key;
    console.log(req.session);
    res.status(200).send({})
  }
);

app.post("/encrypt-infos", (req, res) => {
  console.log(req);

  let key = crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt"]
  );

  const iv = ArrayBuffer(12)
  const buffedData = crypto.subtle.encrypt(
    {
        name: "AES-GCM",

        //Don't re-use initialization vectors!
        //Always generate a new iv every time your encrypt!
        //Recommended to use 12 bytes length
        iv: iv,

        //Additional authentication data (optional)
        additionalData: ArrayBuffer,

        //Tag length (optional)
        tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
    },
    key, //from generateKey or importKey above
    req.body //ArrayBuffer of data you want to encrypt
  )
  .then(function(encrypted){
      //returns an ArrayBuffer containing the encrypted data
      console.log(new Uint8Array(encrypted));
      return encrypted;
  })
  .catch(function(err){
      console.error(err);
  });

  const encoded = Buffer.from(buffedData).toString('base64')
});

app.post("/decryptSecretData", (req, res) => {
  console.log(req);
  let key = crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["decrypt"]
  );

  const iv = ArrayBuffer(12)

  crypto.subtle.decrypt(
    {
        name: "AES-GCM",
        iv: iv, //The initialization vector you used to encrypt
        additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
        tagLength: 128, //The tagLength you used to encrypt (if any)
    },
    key, //from generateKey or importKey above
    buffedData //ArrayBuffer of the data
  )
  .then(function(decrypted){
      //returns an ArrayBuffer containing the decrypted data
      console.log(new Uint8Array(decrypted));
  })
  .catch(function(err){
      console.error(err);
  });
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