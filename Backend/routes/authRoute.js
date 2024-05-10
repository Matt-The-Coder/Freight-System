const express = require('express')
const authRoute = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const db = require('../database/connection')
const axios = require('axios')
const adminAuthServices = require('../services/auth/adminAuth')
const driverAuthServices = require('../services/auth/driverAuth')
const {getAdminAccByUsername, getAdminAccounts } = adminAuthServices()
const {getDriverAccByUsername, getDriverAccounts } = driverAuthServices()
let account = {
  token: '',
  role: ''
}
const verifyToken = (req, res, next) => 
{
  const token = req.session.token
    if(token){
        // req.sessionToken = account.token
        req.sessionToken = req.session.token
        next()
    }else {
      console.log("No token")
      return res.json({message:'No token provided.'});
    }

}
authRoute.get('/alreadyauthenticated', (req, res) => 
{
//  if(account.token){   
//    res.json({auth: true, role: account.role})  
// }else{
//   res.json({auth:false})
// }

if(req.session.token){   
     res.json({auth: true, role: req.session.role})  
}else{
  res.json({auth:false})
}

})
authRoute.get('/homeAuthentication', verifyToken, (req, res) => {
    jwt.verify(req.sessionToken, "secretkey", (err, authData)=>{
        if(err){
          console.log(err)
          return res.json({message: "token is expired, not valid!"})
        }else {
          return res.json({authData})
        }
    })
})

authRoute.delete("/logout", (req, res) => 
{
 // res.clearCookie("token")
  // res.clearCookie("role")
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    return res.json({ message: 'Logout Successful!' });
  });
})
// DRIVER
authRoute.post('/driver/login', async (req, res) => {
  try { 
    const { userName, password } = req.body;
    const user = await getDriverAccByUsername(userName);
    if (user.length === 0) {
      return res.json({ message: "User does not exist" });
    } else {
      const checkPassword = bcrypt.compare(password, user[0]?.d_password);
      
      if (!checkPassword) {
        return res.json({ message: "Password is incorrect!" });
      } else {
        jwt.sign({ user: user }, "secretkey", { expiresIn: '1d' }, (err, token) => {
          if (err) {
            console.log("Cannot create token:", err);
            return res.json({ message: "Cannot create token" });
          }
          
          const role = "driver";
          req.session.token = token;
          req.session.role = role;
          // account.token = token
          // account.role = role
          return res.json({ success: "Login success!", user });
        });
      }
    }
  } catch (error) {
    console.log('Error:', error);
    return res.json({ message: "An error occurred" });
  }
});


// ADMIN
authRoute.post('/admin/login', async (req, res) => {
  try { 
    const { userName, password } = req.body;
    const user = await getAdminAccByUsername(userName);
    
    if (user.length === 0) {
      return res.json({ message: "User does not exist" });
    } else {
      const checkPassword = await bcrypt.compare(password, user[0].u_password);
      
      if (!checkPassword) {
        return res.json({ message: "Password is incorrect!" });
      } else {
        jwt.sign({ user: user }, "secretkey", { expiresIn: '1d' }, (err, token) => {
          if (err) {
            console.log("Cannot create token:", err);
            return res.json({ message: "Cannot create token" });
          }
          
          const role = "admin";
          req.session.token = token;
          req.session.role = role;
          // account.token = token
          // account.role = role
          return res.json({ success: "Login success!", user });
        });
      }
    }
  } catch (error) {
    console.log('Error:', error);
    return res.json({ message: "An error occurred" });
  }
});

    // const sqlQuery = `INSERT INTO fms_g12_drivers ( u_username, u_first_name, u_last_name, u_password, u_email, u_role, u_profile_picture) 
    // VALUES('${username}','${fname}', '${lName}',  '${hashedPassword}', '${email}','${role}', 'qisl53c3a7bsjxqhzjpn.png' )`;

authRoute.get('/register', async (req, res)=>
{
  try {
    const email = 'johndoe@gmail.com'
    const username = 'johndoe'
    const fname = 'Martis'
    const lName = 'Main'
    const password = 'johndoe'
    const role = 'admin'
    const hashedPassword = await bcrypt.hash(password, 10)
       // Generate real data for the remaining fields
       const d_mobile = '1234567890';
       const d_address = '123 Main Street, City, Country';
       const d_age = 30;
       const d_gender = 'Male';
       const d_licenseno = 'ABC123';
       const d_license_expdate = '2025-12-31';
       const d_total_exp = 5;
       const d_doj = '2022-01-01';
       const d_ref = 'John Smith';
       const d_is_active = true;
       const d_picture = 'qisl53c3a7bsjxqhzjpn.png';
       const d_created_by = 'Admin';
       const d_created_date = "2022-01-01";
   
    const sqlQuery = `INSERT INTO fms_g11_accounts ( u_username, u_first_name, u_last_name, u_password, u_email, u_role, u_profile_picture) 
    VALUES('${username}','${fname}', '${lName}',  '${hashedPassword}', '${email}','${role}', 'qisl53c3a7bsjxqhzjpn.png' )`;

      //  const sqlQuery = `INSERT INTO fms_g12_drivers ( 
      //    d_email,
      //    d_username,
      //    d_password,
      //    d_first_name,
      //    d_last_name,
      //    d_mobile,
      //    d_address,
      //    d_age,
      //    d_gender,
      //    d_licenseno,
      //    d_license_expdate,
      //    d_total_exp,
      //    d_doj,
      //    d_ref,
      //    d_is_active,
      //    d_picture,
      //    d_created_by,
      //    d_created_date
      //  ) VALUES (
      //    '${email}',
      //    '${username}',
      //    '${hashedPassword}',
      //    '${fname}',
      //    '${lName}',
      //    '${d_mobile}',
      //    '${d_address}',
      //    '${d_age}',
      //    '${d_gender}',
      //    '${d_licenseno}',
      //    '${d_license_expdate}',
      //    '${d_total_exp}',
      //    '${d_doj}',
      //    '${d_ref}',
      //    '${d_is_active}',
      //    '${d_picture}',
      //    '${d_created_by}',
      //    '${d_created_date}'
      //  )`;
    const result = await db(sqlQuery)
    res.json(result)

  } catch (error) {
    console.error(error)
  }

})
authRoute.get('/addaccess', async (req, res) => {
  try {
    const sqlQuery = `select * from fms_g11_trips `;
    
    const result = await db(sqlQuery);
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

module.exports = authRoute
