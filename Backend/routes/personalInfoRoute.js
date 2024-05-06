const express = require('express')
const personalInfoRoute = express.Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const db = require('../database/connection')
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

  const storage = new multer.memoryStorage();
  const upload = multer({
    storage,
  });
  

personalInfoRoute.get('/getNotifications', async (req, res)=>{
  try {
    const query = `Select * from fms_g11_notifications`
    const data = await db(query)
    res.json(data)
} catch (error) {
    console.log(error)
}
})

personalInfoRoute.put('/updateNotifications/:id', async (req, res)=>{
  try {
    const {id} = req.params
    const query = `Update fms_g11_notifications set n_isRead = 1 where n_id = ${id}`
    const data = await db(query)
    res.json(data)
} catch (error) {
    console.log(error)
}
})

personalInfoRoute.post('/insertNotifications', async (req, res)=>{
  try {
    const {description } = req.body
    const query = `Insert into fms_g11_notifications (n_description) values ('${description}')`
    const data = await db(query)
    res.json(data)
} catch (error) {
    console.log(error)
}
})
personalInfoRoute.post('/updatePersonalInfo', async (req, res)=>{
    const {fName, lName, uName, email, u_id:id} = req.body
    try {
        const query = `UPDATE fms_g11_accounts SET u_username = '${uName}', u_first_name = '${fName}', u_last_name = '${lName}', u_email = '${email}' WHERE u_id = ${id}`
       const data = await db(query)
       res.json(data)
    } catch (error) {
      console.log(error)
        res.json({errorMessage:"Username already exists!"})
    }

})
personalInfoRoute.post('/updateSecurityInfo', async (req, res)=>{
    const {nP:newPassword, u_id:id} = req.body
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const query = `UPDATE fms_g11_accounts SET u_password = '${hashedPassword}' WHERE u_id = ${id}`
    const result = await db(query)
   res.json({message:"Updated Successfully!"}) 
})
personalInfoRoute.get('/getaccountbyid/:id', async (req, res) => 
{
    try {
        const {id} = req.params
        const query = `Select * from fms_g11_accounts where u_id = ${id}`
        const result = await db(query)
        res.json(result)
    } catch (error) {
        res.json({message: "Wrong ID"})
    }

})
personalInfoRoute.get("/getAccess/:id", async (req, res) => 
{
    const {id} = req.params
    const query = `Select * from fms_g11_accounts_access where a_u_id = ${id}`
    const result = await db(query)
    res.json({data: result}) 
})

personalInfoRoute.post("/upload/:id", upload.single("my_file"), async (req, res) => {
    try {

            const {id} = req.params
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      const path = cldRes.url.split('/').pop()
    const query = `Update fms_g11_accounts set u_profile_picture = '${path}' where u_id = ${id}`
      const result = await db(query)
      res.json(cldRes);
      

    } catch (error) {
      console.log("The error", error);
      res.send({
        message: error.message,
      });
    }
  });

  personalInfoRoute.get('/getaccountbyusername', async (req, res) => 
{
    try {
        const {username} = req.query
        const query = `Select * from fms_g11_accounts where u_username = '${username}'`
        const result = await db(query)
        res.json(result)
    } catch (error) {
        res.json({message: "Wrong ID"})
    }

})

// For localhost
// Change profile picture
// personalInfoRoute.post('/changeProfile/:id', upload.single('image'), async (req, res) => 
// {
//     const {id} = req.params
//     try {
//         const query = `Update accounts set u_profile_picture = '${req.file.filename}' where u_id = ${id}`
//         await db(query)
//         res.json({status: 'Success'})
//     } catch (error) {
//         res.json({status: 'Failed'})
//     }
// })
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({
//     storage:storage
// })
personalInfoRoute.get('/getProfilePicture/:id', async (req, res) => 
{   
    const {id} = req.params
    try {
        const query = `Select u_profile_picture from fms_g11_accounts where u_id = ${id} `
        const result = await db(query)
        res.json({image: result})
    } catch (error) {
        console.log(error)
        res.json({status: "Failed to get profile picture"})
    }
})




// FOR DRIVERS



personalInfoRoute.post('/updateDriverPersonalInfo', async (req, res)=>{
  const {fName, lName, uName, email, d_id:id} = req.body
  try {
      const query = `UPDATE fms_g12_drivers SET d_username = '${uName}', d_first_name = '${fName}', d_last_name = '${lName}', d_email = '${email}' WHERE d_id = ${id}`
      await db(query)
      res.json({message:"success"})
  } catch (error) {
      res.json({errorMessage:"Username already exists!"})
  }

})
personalInfoRoute.post('/updateDriverSecurityInfo', async (req, res)=>{
  const {nP:newPassword, d_id:id} = req.body
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const query = `UPDATE fms_g12_drivers SET d_password = '${hashedPassword}' WHERE d_id = ${id}`
  const result = await db(query)
 res.json({message:"Updated Successfully!"}) 
})
personalInfoRoute.get('/getdriveraccountbyid/:id', async (req, res) => 
{
  try {
      const {id} = req.params
      const query = `Select * from fms_g12_drivers where d_id = ${id}`
      const result = await db(query)
      res.json(result)
  } catch (error) {
      res.json({message: "Wrong ID"})
  }

})
personalInfoRoute.get("/getDriverAccess/:id", async (req, res) => 
{
  const {id} = req.params
  const query = `Select * from fms_g11_driver_access where a_u_id = ${id}`
  const result = await db(query)
  res.json({data: result}) 
})

personalInfoRoute.post("/driver/upload/:id", upload.single("my_file"), async (req, res) => {
  try {

          const {id} = req.params
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    const path = cldRes.url.split('/').pop()
  const query = `Update fms_g12_drivers set d_picture = '${path}' where d_id = ${id}`
    const result = await db(query)
    res.json(cldRes);
    

  } catch (error) {
    console.log("The error", error);
    res.send({
      message: error.message,
    });
  }
});

personalInfoRoute.get('/getdriveraccountbyusername', async (req, res) => 
{
  try {
      const {username} = req.query
      const query = `Select * from fms_g12_drivers where d_username = '${username}'`
      const result = await db(query)
      res.json(result)
  } catch (error) {
      res.json({message: "Wrong ID"})
  }

})

// For localhost
// Change profile picture
// personalInfoRoute.post('/changeProfile/:id', upload.single('image'), async (req, res) => 
// {
//     const {id} = req.params
//     try {
//         const query = `Update accounts set u_profile_picture = '${req.file.filename}' where u_id = ${id}`
//         await db(query)
//         res.json({status: 'Success'})
//     } catch (error) {
//         res.json({status: 'Failed'})
//     }
// })
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({
//     storage:storage
// })
personalInfoRoute.get('/getDriverProfilePicture/:id', async (req, res) => 
{   
  const {id} = req.params
  try {
      const query = `Select d_picture from fms_g12_drivers where d_id = ${id} `
      const result = await db(query)
      res.json({image: result})
  } catch (error) {
      console.log(error)
      res.json({status: "Failed to get profile picture"})
  }
})
module.exports = personalInfoRoute