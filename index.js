const express = require('express');
const path = require('path');
const port = 8001;

const db=require('./config/mongoose');
const Contact=require('./models/contact');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

var contact2={
    name:"",
    num:"",
    _id:""
  };
// var contactList = [
//     {
//         name: "Arpan",
//            p: "1111111111"
//     },
//     {
//         name: "Tony Stark",
//         p: "1234567890"
//     },
//     {
//         name: "Coding Ninjas",
//         p: "12131321321"
//     }
// ]
app.post('/search',function(req,res){
    console.log(req.body);
    let nam = req.body.name;
    Contact.findOne({name:nam},function(err,user){
        if(!user){
            Contact.findOne({phone:nam},function(err,user){
              if(!user){
               console.log('error in finding the object from database');
               return;
              }
              console.log(user);
              contact2.name = user.name;
              contact2.num = user.phone;
              contact2._id = user._id;
              console.log(contact2);
            });
            return;
        }
        console.log(user);
        contact2.name = user.name;
        contact2.num = user.phone;
        contact2._id = user._id;
        console.log(contact2);
    });
    return res.redirect('back');
 });

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});


app.get('/', function(req, res){


    Contact.find({/*here u can write name and it show only that contact for ef (name:Contact_name)*/},function(err,contacts){
          if(err)
          {
              console.log("Error in fetching contact");
              return;
          }
        return res.render('home',{
            title:"My Contact List",
            contact_list:contacts,
            searched:contact2
        });

    });

    // return res.render('home',{
    //     title: "Contact List",
    //     contact_list: contactList
});

app.post('/create-contact', function(req, res){
    
    // contactList.push(req.body);
    Contact.create({               //accesing our schema from Contact as we require from it
        name:req.body.name,
        phone:req.body.phone      // because our schema is like that that take phone and name
    }, function(err,newContact){
           if(err)
           {
               console.log(err);
           }
       console.log("/............/",newContact);
       return res.redirect('/');
           
    });

    // return res.redirect('/');

});

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})
app.get('/clear-contact/', function(req, res){

    contact2.name ="";
    contact2.num ="";
    contact2._id ="";

    return res.redirect('back');
    
});


app.get('/delete-contact/', function(req, res){


    let id = req.query.id;
    contact2.name ="";
    contact2.num ="";
    contact2._id ="";
    
   Contact.findByIdAndDelete(id,function(err){
             if(err)
             {
                 console.log("Oops we can't Delete it rit now");
             }
             return res.redirect('back');
   });
    
});
