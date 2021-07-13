const express = require('express');
const db = require('../model/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const router = express.Router();


//localhost:5000/employee
router.post('/signup',async (req,res)=>{
    
    const {name,email,pno,password,mode} = req.body
    if(!name || !email || !pno || !password || !mode){
    return res.status(422).json({error:'Please Add All the Fields'})
    }else{
    try {
        let encrypted =  await bcrypt.hash(password,10);
        const user = {name,email,phone:pno,password:encrypted,mode}
        let sql = "INSERT INTO `users` SET ?";
        db.query(sql,user,(err,result)=>{
            if(err) {
                return res.status(422).json({error:err.sqlMessage})
            }else{
                return res.status(200).json({msg:'User Added Succesfully'})
            }
        })        
    } catch (error) {
        return res.status(500).json({error:error})
    }

}
})

//login
router.post('/signin', (req,res) =>{

    const {email,password,mode} = req.body
    if(!email || !password || !mode){
        return res.status(422).json({error:"please add email and password"})
    }
    let sql = `SELECT * FROM  users where email = '${email}' AND mode = '${mode}'`;
    db.query(sql,(err,result)=>{
       if(err) return res.status(422).json({error:err});
       if(result.length==0) return res.status(422).json({msg:"Invalid Email "})
       try {
        bcrypt.compare(password,result[0].password)
        .then(matchPassword => {
            if(matchPassword){
                const token = jwt.sign({_id:result[0].password},JWT_SECRET)
                 return res.status(200).json({token})
            }else{
                return res.status(400).json({msg:"Invalid Password"})
            }
        })
       } catch (error) {
        return res.status(400).json({error:error})           
       }
   });

})


module.exports = router;