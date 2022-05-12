const express = require('express')
const app = express()
const port = 3000

const fs = require('fs')

let ejs = require('ejs');
let people = ['geddy', 'neil', 'alex'];

app.use("/static",express.static("static"))
app.use(express.urlencoded({extended:true}))
  
app.get('/', async(req, res) => {   
    
    ejs.renderFile("./template/index.ejs", [], {}, function(err, str){

        res.send(str)
    });
    
 
})


app.get('/add_a_game', async(req, res) => {   
    
    ejs.renderFile("./template/create_game.ejs", [], {}, function(err, str){

        res.send(str)
    });

})

app.get('/add_a_category', async(req, res) => {   
    
    ejs.renderFile("./template/create_category.ejs", [], {}, function(err, str){

        res.send(str)
    });

})

app.post('/add_a_game', (req,res) => {

    console.log(req.body)

    let data=JSON.parse(fs.readFileSync("./data/products.json"))
    data.data.push({

        name:req.body.name,
        developer: req.body.developer,
        category: req.body.category,
        image: req.body.artwork,
        url_site:req.body.site_link,
        url_video:req.body.gameplay_link

    }) 
    fs.writeFileSync('./data/products.json',JSON.stringify(data))
    ejs.renderFile("./template/create_game.ejs", [], {}, function(err, str){

        res.send(str)
    });
})

app.post('/add_a_category', (req,res) => {

    console.log(req.body)

    let data=JSON.parse(fs.readFileSync("./data/categories.json"))
    data.data.push({

        name: req.body.category

    }) 
    fs.writeFileSync('./data/categories.json',JSON.stringify(data))
    ejs.renderFile("./template/create_category.ejs", [], {}, function(err, str){

        res.send(str)
    });
})



app.get('/games', async(req, res) => {   
    
    let data=JSON.parse(fs.readFileSync("./data/products.json"))
    console.log(data)
    ejs.renderFile("./template/games.ejs", {products:data.data}, {}, function(err, str){
        if(err)
        {
            return res.send(err.message)
        }
        res.send(str)
    });
    
 
})


app.use((req, res, next) => {

    ejs.renderFile("./template/404.ejs", [], {}, function(err, str){
        res.status(404).send(str)
     
    });

   
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




