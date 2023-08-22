const mongoose = require('mongoose');
const uuid = require('uuid');

const userSchema = mongoose.Schema({
     username : {
         type : String ,
         require : [true, 'enter the valid value']
     },
     email :{
        type : String ,
        require : [true , 'enter the valid value'],
        unique : [true , 'email addrress is already taken'] 
    },
     password:{
        type : String,
        require : [true , 'enter the valid value']
     },
     mobile_no : {
        type : String ,
        require : [true , "enter the valid mobile number"]
     },
     refer_by : {
         type : String
     },
     reference_code:{
        type : String,
        default: referenceCode(),
     },
     isVeryfied : {
        type : Number,
        default: 0
     } ,
     status : {
        type : Number,
        default : 0,
     }
},{ timestamps: true });

function referenceCode() {
    const uuidWithoutHyphens = uuid.v4().replace(/-/g, '');
    return 'PYS-' + uuidWithoutHyphens.slice(0, 15);
}

module.exports = mongoose.model('User' , userSchema);