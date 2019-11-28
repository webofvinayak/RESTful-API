//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true });

//Mongoose Scheme and Model creating
     const articleSchema = {
         title: String,
         content:String
     };
 //Mongoose model
      const Article = mongoose.model("Article",articleSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///?///////////////reuesting all documents /////////////

app.route("/articles")

.get(function(req,res){
   Article.find(function(err,foundArticles){
   console.log(foundArticles);
   res.send(foundArticles);
  });

  })

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content:req.body.content });

      newArticle.save(function(err){
        if(!err){res.send("succesfully added New Article");}
        else{ res.send(err);}
      });

    })

.delete(function(req,res){
      Article.deleteMany(function(err){
        if(!err){res.send("Succesfully deleted all Articles");}
        else{res.send("error at delete method"+err);}
      });

    });

///////////////////////////requesting specific articles///////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){res.send(foundArticle);}
    else{res.send("no article matcing Title found");}
  });
})
.put(function(req,res){
   Article.update(
     {title:req.params.articleTitle},
     {title:req.body.title, content:req.body.content},
     {overwrite:true},
     function(err){
       if(err){
         console.log(err);
       }else{res.send("no errori");}

   });

}).patch(function(req,res){

   Article.update({title:req.params.articleTitle},
           {$set:req.body},
           function(err){
             if(!err){res.send("succesfully patched up article document !!");}
           });
}).delete(function(req,res){
   Article.deleteOne({title:req.params.articleTitle},function(err){
       if(!err){
            res.send("successfully deleted the given Item !!");  
          }

   });

});

/*
app.get("/articles",);


app.post("/articles",);

app.delete("/articles",);
*/


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
