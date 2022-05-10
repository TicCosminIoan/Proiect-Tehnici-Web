const express = require('express')
const app = express()
const port = 3000

const fs = require('fs')

let ejs = require('ejs');
let people = ['geddy', 'neil', 'alex'];

app.use("/static",express.static("static"))

app.get('/', async(req, res) => {   
    
    ejs.renderFile("./template/index.ejs", [], {}, function(err, str){

        res.send(str)
    });
    
 
})

app.get('/add_a_game', (req,res) => {

    let data=JSON.parse(fs.readFileSync("./data/products.json"))
    data.data.push({

        "name":"Assassin's Creed Valhalla",
        "developer":"Ubisoft",
        "image":"/static/Photos/assassin-s-creed-valhalla-raid-i96340.jpg",
        "url_site":"https://www.ubisoft.com/en-gb/game/assassins-creed/valhalla",
        "url_video":"https://www.youtube.com/watch?v=FApX-M_DrDc"

    }) 
    fs.writeFileSync('./data/products.json',JSON.stringify(data))
    res.send("DONE")
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

