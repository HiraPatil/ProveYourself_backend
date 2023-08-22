const asyncHandler = require('express-async-handler')
const Contact = require('../models/contactModel')

const getContacts = asyncHandler(async(req,res)=>{
    const contact =await  Contact.find({user_id : req.user.id});
    res.json({"data" : contact});
});

const getContact = asyncHandler(async(req , res)=>{
    const id = req.params.id;
    const contact = await Contact.findById(id);
    if(!contact){
        res.status(404);
        throw new Error("Not Found");
    }else{
        res.status(200).json({"data":contact});
    }
  
});

const createContact = asyncHandler(async(req,res) =>{
    const {name , email , phone} = req.body;
    if(!name || !email || !phone){
        res.status(404);
        throw new Error("all field are mendotory");
    }
    const contact = await Contact.create({
        name ,
        email,
        phone,
        user_id : req.user.id,
    });
    contact.save();
    res.status(200).json({"data" : contact});
});

const updateContact = asyncHandler(async(req,res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.send(403);
        throw new Error("user dont have to permission to update the this user");
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );

    res.status(200).json({"data" : updateContact});
});

const deleteContact = asyncHandler(async(req,res) =>{
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if(!contact){
       res.status(404);
       throw new Error("Contact not Found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.send(403);
        throw new Error("user dont have to permission to delelt the this user");
    }
    res.status(200).json({"message" : contact});
});


module.exports = {createContact ,getContact, getContacts , updateContact , deleteContact};