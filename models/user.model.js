const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    //!for normal
//     userName:String,
//     email:String,
//     password:String
    //! for production lvl
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    minlength:[3,'Username must be at least 3 character long']  //length and message
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    minlength:[13,'Email must be at least 13 character long']
},
password:{
    type:String,
    required:true,
    trim:true,
    minlength:[5,'Password must be at least 8 character long']
}
})

const user =mongoose.model('user',userSchema)

module.exports=user;