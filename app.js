//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const _ = require("lodash");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/wikiDB");

mongoose.connect(process.env.MONGODB_URL);

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(async (req, res) => {
    try{
        const foundArticles =  await Article.find({})
        if (foundArticles) {
            res.send(foundArticles);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding articles.");
      }  
})

.post(async (req, res) => {
  
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    const newFoundArticle = await newArticle.save();

    try{
        if(newFoundArticle) {
            res.send("Successfully added a new article.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating a new article.");
      }  


})

.delete(async (req, res) => {
    const deleteArticle = await Article.deleteMany();
     
    try{
        if(deleteArticle) {
            res.send("Successfully deleted all articles")
        }
     } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting all article.");
      }  
});

app.route("/articles/:articleTitle")

.get(async (req, res) => {
    const requestedArticle = await Article.findOne({title: req.params.articleTitle});   

    try{
        if(requestedArticle) {
            res.send(requestedArticle);
        } 

    }  catch (err) {
        console.error(err);
        res.status(500).send("No article matching the title was found.");
      }  
})

.put(async (req, res) => {
    const updatedArticle = await Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
    );

    try{  
        if (updatedArticle) {
            res.send("Successfully updated article.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not update the article.");
      }  
})

.patch(async (req, res) => {
    const updateArticle = await Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
    );

    try{  
        if (updateArticle) {
            res.send("Successfully updated article.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not update the article.");
      }  
})

.delete(async (req, res) => {
    const deletedArticle = await Article.deleteOne(
        {title: req.params.articleTitle}
    )

    try{  
        if (deletedArticle) {
            res.send("Successfully deleted article.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not delete the article.");
      }  

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });

