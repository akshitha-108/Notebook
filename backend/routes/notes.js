const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note') 
const {body, validationResult} = require('express-validator')

//the user who is loggedin , tht user ka notes fetch from database
//ROUTE 1: Get All the NOtes using: GET "/api/auth/getuser".Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        
    const notes = await Note.find({user:req.user.id});
    res.json(notes)
} catch(error){
    console.log(error.message)
    res.status(500).send("Some error occured")
}
})

//ROUTE 2: Add a new  Notes using: post  "/api/auth/addnote".Login required
router.get('/addnote',fetchuser,[
    body('title','enter a valid title').isLength({min:3}),
    body('description','description must be atleast 5 characters').isLength({min:5}),

],async (req,res)=>{
    try {
    
    const {title,description,tag}= req.body;
    //if there are errors, return Bad request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const note = new Note({
        title, description,tag,user:req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote)
        
} catch(error){
    console.log(error.message)
    res.status(500).send("Some error occured")
}
})

//ROUTE 3: Update an existing  Notes using: post  "/api/auth/updatenote".Login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try{
const {title,description,tag}=req.body;
//create a newnote object 
const newNote={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

//find the note to be updated and update it 
let note = await Note.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")}
if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
}
note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
res.json(note)
    }catch(error){
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
})



//ROUTE 4: DELETE an existing  Notes using: DELETE  "/api/auth/updatenote".Login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try{
   
    
    //find the note to be updated and delted it 
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    //allow deletion pnly of user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"note has been deleted"})
}catch(error){
    console.log(error.message)
    res.status(500).send("Some error occured")
}
    })

module.exports=router