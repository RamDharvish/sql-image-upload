const nodemailer = require('nodemailer');
const express=require('express')
const cors=require('cors')
const mysql=require('mysql')
const multer=require('multer')
const path=require('path')


const app=express()

app.use(express.json())
app.use(cors())

app.use(express.static('public'))
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"images_upload"

})

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage
})


app.get('/',(req,res)=> {


    var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dharvish1234@gmail.com',
    pass: 'hypbbrrounimacvz'
  }
});

var mailOptions = {
  from: 'dharvish1234@gmail.com',
  to: 'ramdharvish479@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy dude!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.send(mailOptions.text)
  }
}); 
})

app.post('/upload',upload.single('image'),(req,res)=>{
       const image=req.file.filename
       const sql = `UPDATE img SET image=?`;
       db.query(sql,[image],(err,result)=>{
        if(err) return res.json({message:"error"})
        return res.json({message:"success"})
       })

})

app.get('/getImg',(req,res)=>{
    const sql="select * from img"

    db.query(sql,(err,result)=> {
        if(err) return res.json("error")
        return res.json(result)
    })
})




app.listen(5000,()=>console.log("running"))