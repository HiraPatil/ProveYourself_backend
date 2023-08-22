const express = require('express');
const router = express.Router();


const {createContact ,getContact, getContacts , updateContact , deleteContact} = require("../Controller/contactController");
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route("/").get(getContacts);

router.route("/").post(createContact);

// router.route("/:id").get((req,res)=>{
//     res.json({"messege" : `get the contact associate with this ${req.params.id}`});
// });

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

router.route("/:id").post(getContact);


module.exports = router;