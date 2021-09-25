const express = require("express");
const app = express();  //Create new instance
const PORT = process.env.PORT || 8888; //Declare the port number
app.use(express.json()); //allows us to access request body as req.body
 

const mockUser = {
  user: "GabrielChouinardLetourneau",
  pw: "root"
}

// Add sub-routes
app.post("/login", (req, res) => {

  if (req.params.pw !== mockUser.pw) return res.status(401).redirect("/").end()

  let key = window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["derive", "encrypt", "decrypt"]
  );

  // Derive
  let derivedKey = window.crypto.subtle.deriveKey(
    {
        "name": "PBKDF2",
        salt: window.crypto.getRandomValues(new Uint8Array(16)),
        iterations: 1000,
        hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    key, //your key from generateKey or importKey
    { //the key type you want to create based on the derived bits
        name: "AES-CTR", //can be any AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
        //the generateKey parameters for that type of algorithm
        length: 256, //can be  128, 192, or 256
    },
    false, //whether the derived key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //limited to the options in that algorithm's importKey
  )
  .then(function(key){
      //returns the derived key
      return key
  })
  .catch(function(err){
      console.error(err);
  });


  // Encrypt
  const buffer = window.crypto.subtle.encrypt(
    {
        name: "AES-GCM",

        //Don't re-use initialization vectors!
        //Always generate a new iv every time your encrypt!
        //Recommended to use 12 bytes length
        iv: window.crypto.getRandomValues(new Uint8Array(12)),

        //Additional authentication data (optional)
        additionalData: ArrayBuffer,

        //Tag length (optional)
        tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
    },
    derivedKey, //from generateKey or importKey above
    req.pw //ArrayBuffer of data you want to encrypt
  )
  .then(function(encrypted){
      //returns an ArrayBuffer containing the encrypted data
      return new Uint8Array(encrypted);
  })
  .catch(function(err){
      console.error(err);
  });

  const encoded = Buffer.from(buffer).toString("base64")



});

app.post("/encryptSecretData", (req, res) => {
  let buffedData

  let key = window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["derive", "encrypt", "decrypt"]
  );



  window.crypto.subtle.decrypt(
    {
        name: "AES-GCM",
        iv: ArrayBuffer(12), //The initialization vector you used to encrypt
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