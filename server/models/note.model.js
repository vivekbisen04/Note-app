const mongoose=require("mongoose");

const noteSchema=new mongoose.Schema({

  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  tags:{
    type:[String],
    default:[]
  },
  isPined:{
    type:Boolean,
    default:false
  },
  userID:{
    type:String,
    required:true
  },
  createdOn:{
    type:Date,
    default:Date.now,
  }

})


module.exports=mongoose.model("Note",noteSchema)