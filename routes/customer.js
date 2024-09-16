var express = require('express');
var router = express.Router();
const customerModel = require("multer");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"./public/images");
  },
  filename: (req, file, cb) =>{
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
  },
});
const upload = multer({ storage: diskStorage });
/* GET home page. */
router.get('/', async(req, res) => {
  const customers = await customerModel.find();
  res.render('customer/index', { title:"Customer List", customers });
});

router.get('/create', (req, res)=>{
  res.render('customer/create', {title: "Create customers"});
})

router.post('/create',[
  body('fullname').notEmpty().withMessage("pls input fullname"),
  body('email').notEmpty().withMessage("pls input email").
  isEmail().withMessage("email wrong format. pls input email with form abc.@gmail.com").
  custom(async(value)=>{
    const exited = await customerModel.findone({email: value});
    if(exited){
      throw new error("email is exited");
    }
  }),
  body('password').notEmpty().withMessage("pls input password"),
 upload.single('image')],
  async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.render("customer/create",{
        title: " Create customer",
        errors: errors.arrays(),
      });
    }
  let cust = new customerMoldel(req.body);
  cust.image = req.file.filename;
  await cust.save();
  res.redirect("/customer")

})

module.exports = router;
