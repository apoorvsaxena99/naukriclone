const express = require('express');
const router = express.Router();
const db = require('../model/connection')
const requireLogin = require('../middleware/requireLogin')

//Create a job
router.post('/createjob',requireLogin,(req,res) => {
  if(req.user.mode == "recuriter"){
    const {title,description,duration,name} = req.body
    // if(!title || !description || !duration || !name){
    //     return res.status(422).json({error:'Please Add All the Fields'})
    // }
    const newDate = ConvertData(duration)
    const job = {recruiter_id :req.user.id,title,description,duration:newDate,name}
    let sql = "INSERT INTO `jobs` SET ?";
    
    db.query(sql,job,(err,result)=>{
        if(err) {
            return res.status(422).json({error:err.sqlMessage})
        }else{
            return res.status(200).json({msg:'Job Created Succesfully'})
        }
    })        

  } else{
      return res.status(200).json({msg:'Please Login as a Recuriter'})
  }

})

//View a job
router.post('/showjob',requireLogin,(req,res)=>{
    if(req.user.mode == "recuriter"){
        let id = req.user.id
        let sql = "SELECT * FROM `jobs` WHERE `recruiter_id` = "+id;
        db.query(sql,(err,result)=>{
            if(err) {
                return res.status(422).json({error:err.sqlMessage})
            }else{
                return res.status(200).json({job:result})
            }
        })
    }else{
        return res.status(200).json({msg:'Please login as a Recuriter'})
    }
})

//Show Applied candidate Application 
router.get('/showappliedcandidate',requireLogin,(req,res) =>{
    if(req.user.mode == "recuriter"){
        let id = req.user.id
        let sql = "select jobs.name,jobs.title,jobs.description,jobs.duration from jobs INNER JOIN applied_jobs as app_jobs ON jobs.id=app_jobs.id where recruiter_id="+id;
        console.log(sql)
        db.query(sql,(err,result)=>{
            if(err) {
                return res.status(422).json({error:err.sqlMessage})
            }else{
                return res.status(200).json({job:result})
            }
        })
    }else{
        return res.status(200).json({msg:'Please login as a Recuriter'})
    }
})


function ConvertData(duration) {
    var date = new Date(duration);
    let newdate = date.toISOString().slice(0, 19).replace('T', ' ');
    return newdate;
}

module.exports = router