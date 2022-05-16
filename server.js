const express = require('express')
const crypto = require('crypto');
const cookieSession = require('cookie-session')
const slugify = require('slugify');

const games = require('./games')

const app = express()
const port = 3000

const fs = require('fs')

let ejs = require('ejs');
let categories = JSON.parse(fs.readFileSync("./data/categories.json"));

app.use("/static",express.static("static"))
app.use(express.urlencoded({extended:true}))
app.use(cookieSession({
    name: 'session',
    keys: ['secretkey1', 'secretkey2'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use((req, res, next) => {
    req.params.categories = categories;
    res.renderFile = function (file, params) {
        let defaults = {
            categories,
            singedIn: req.session.loggedIn || false
        };
        params = {...defaults, ...params}
        ejs.renderFile(`./template/${file}.ejs`, params, {}, function(err, str) {
            if (err) {
                res.status(500).send(err.message);
            }
            res.send(str)
        });
    }
    next();
})

app.get('/', async(req, res) => {
    res.renderFile('index', {}, res);
})

app.get('/categories', async(req, res) => {
    res.renderFile("categories", { categories });
})

app.get('/add_a_category', async(req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    res.renderFile("create_category", { values: {} }, res);
})


app.post('/add_a_category', (req,res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    categories.push({
        id: slugify(req.body.name),
        name: req.body.name,
        image: req.body.image,
    })


    fs.writeFileSync('./data/categories.json',JSON.stringify(categories))
    res.redirect('/categories');
})



app.post('/category/edit/:id', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    categories = categories.map(category => {
        if (category.id !== req.params.id) {
            return category;
        }

        return {
            id: slugify(req.body.name),
            image: req.body.image,
            name: req.body.name
        }
    })

    fs.writeFileSync('./data/categories.json',JSON.stringify(categories))

    res.redirect('/categories');
})
app.get('/category/edit/:id', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    let category = categories
      .find(product => product.id === req.params.id);

    if (!category) {
        res.redirect('/categories')
    }

    fs.writeFileSync('./data/categories.json', JSON.stringify(categories));

    res.renderFile('edit_category', { values: category })
})

app.post('/category/delete/:id', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    categories = categories.filter(category => category.id !== req.params.id)

    fs.writeFileSync('./data/categories.json', JSON.stringify(categories));

    res.send({ success: true });
})

app.get('/logout', async(req, res) => {
    req.session.loggedIn = false;

    res.redirect('/');
})
app.get('/login', async(req, res) => {
    res.renderFile("login", { hasError: false });
})
app.post('/login', async(req, res) => {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));

    let user = users.find(user => {
        return user.username === req.body.username &&
          user.password === crypto.createHash('sha1').update(req.body.password + user.hash).digest('hex');
    })

    if (user) {
        req.session.loggedIn = true;
        req.session.username = user.username;

        return res.redirect('/games');
    }

    res.renderFile("login", { hasError: true });
})

// from: https://github.com/expressjs/express/blob/master/examples/route-separation/index.js
app.get('/games', games.list)
app.get('/add_a_game', games.create)
app.post('/add_a_game', games.save);
app.get('/games/:category', games.listByCategory)
app.get('/games/delete/:id', games.remove)
app.get('/games/edit/:id', games.edit)
app.post('/games/edit/:id', games.save)
app.post('/games/delete/:id', games.jsonDelete)

app.use((req, res, next) => {
    res.renderFile("404", {}, res.status((404)));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




