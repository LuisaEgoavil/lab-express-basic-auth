const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

//GET signin page
router.get('/signin', (req,res,next)=>{
    res.render('auth/signin.hbs')
})


//GET signup page
router.get('/signup', (req,res,next)=>{
    res.render('auth/signup.hbs')
})


//handle POST
router.post('signup', (req, res, next) =>{
    const {username, password} = req.body
})


//validate
//check if the user entered all the fields
if (!username.length || !password.length) {
    res.render ('auth/signup', {msg: 'Please enter all fields'})
    return;
}

//validate also the right format

//validate password


//create a salt
let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync(password, salt);
UserModel.create({username, password: hash})
   .then(()=>{
        res.redirect('/')
   })
   .catch((err)=>{
        next(err)
})



 //handle post request when the user submits
 router.post('/signin', (req, res, next)=> {
     const {username, password} = req.body

     UserModel.findOne({username:username})
         .then((result)=>{
             if (result) {
                 bcrypt.compare(password, result.password)
                    .then((isMatching)=>{
                        if (isMatching) {
                            req.session.loggedInUser = result
                            res.redirect('/profile')
                        }
                        else {
                            res.render('auth/signin.hbs', {msg: 'Passwords dont match'})
                        }
                    })
             }
             else {
                 res.render('auth/signin.hbs', {msg: 'Email does not exist'})
             }
         })
         .catch((err)=>{
             next(err)
         })
});

//Middleware to protect routes
const checkLoggedInUser = (req, res, next) => {
    if (req.session.loggedInUser) {
        next()
    }
    else {
        res.redirect('/signin')
    }
}

router.get('/profile',checkLoggedInUser, (req,res,next) =>{
    let username = req.session.loggedInUser.username
    res.render('profile.hbs', {username})
})

router.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect('/')
})


//export
module.exports = router;