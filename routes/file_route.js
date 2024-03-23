const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        cd(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: (req, file , cd)=>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
              cd(null, true);
            }else{
                cd(null, false);
                return res.status(400).json({ error: "File types allowed are .jpeg, .jpg, .png" });
            }
    }
});

router.post("/uploadFile",upload.single('file'),function(req, res){
    res.json({ "fileName": req.file.filename });
});

const downloadFile = (req,res)=>{
    const fileName =  req.params.filename;
    const path = __basedir + "/uploads/";

    res.download(path + fileName, (error)=>{
        if(error){
            res.status(500).send({message: "File cannot be downloaded "+ error })
        }
    })
}
router.get("/files/:filename", downloadFile);

module.exports = router;