const fs = require("fs");
const slugify = require("slugify");

module.exports.save = (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  let data = JSON.parse(fs.readFileSync("./data/products.json"))

  let values = {
    id: slugify(req.body.name),
    name: req.body.name,
    developer: req.body.developer,
    category: req.body.category,
    image: req.body.image,
    url_site: req.body.url_site,
    url_video: req.body.url_video
  };

  let isValid = true;

  Object.keys(values).forEach(key => {
    if (!values[key]) {
      isValid = false;
    }
  });

  if (isValid) {
    if (req.params.id) {
      data = data.map(item => {
        if (item.id !== req.params.id) return item;

        return values;
      })
    } else {
      data.push(values);
    }

    fs.writeFileSync('./data/products.json', JSON.stringify(data));

    return res.redirect('/games');
  }

  res.renderFile("create_game", { values, isValid });
}


module.exports.create = (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  res.renderFile("create_game", { values: {} }, res);
}

module.exports.list = (req, res) => {
  let products = JSON.parse(fs.readFileSync("./data/products.json"))

  res.renderFile("games", { products });
}

module.exports.listByCategory = (req, res) => {
  let products = JSON.parse(fs.readFileSync("./data/products.json"))
    .filter(product => product.category === req.params.category)

  res.renderFile("games", { products });
}

module.exports.edit = (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  let product = JSON.parse(fs.readFileSync("./data/products.json"))
    .find(product => product.id === req.params.id);

  if (!product) {
    res.redirect('/games')
  }

  res.renderFile('edit_game', { values: product })
}

module.exports.remove = (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  let products = JSON.parse(fs.readFileSync("./data/products.json"))
    .filter(product => product.id !== req.params.id);

  fs.writeFileSync('./data/products.json', JSON.stringify(products));

  res.renderFile('edit_game', { values: product })
}

module.exports.jsonDelete = (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).send({
      success: false
    });
  }

  let products = JSON.parse(fs.readFileSync("./data/products.json"))
    .filter(product => product.id !== req.params.id)

  fs.writeFileSync('./data/products.json', JSON.stringify(products));

  res.send({ success: true });
}
