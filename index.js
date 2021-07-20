const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 5000;
const pool = require('./dbconfig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'image/jpg' || 'image/jpeg' || 'image/png'){
        cb(null, true);
    }else{
        cb(new Error('Image should be  jpg or jpeg or png type'), false);
    }
}
const upload = multer({ storage: storage,limits: {fileSize: 1024*1024*5},fileFilter : fileFilter,});


app.post('/api/upload',upload.single('image'), async(req, res, next) => {
    try{
        let image = req.file.filename;
        const sql = `insert into upload_image(image) values('${image}')`;
        await pool.query(sql);
        res.status(200).json("Image uploaded successfully");
    }catch(error){
        res.status(400).json({error: error});
    }
});

app.get('/api/display', async(req, res, next) => {
    try{
        const sql = `select * from upload_image`;
        let response = await pool.query(sql);
        res.status(200).json({message: response});
    }catch(error){
        res.status(400).json({error: error});
    }
});

//port
app.listen(port, () => {
    console.log(`Port no. ${port} is running`);
});
   