  const express = require('express');
  const handlebars = require('express-handlebars');
  const app = express();
  app.use(express.static("assets"));
  app.engine('handlebars', handlebars({
    defaultLayout: 'main'
  }));
  app.set('view engine', 'handlebars');

  app.get('/', function (req, res) {
      res.render("home");
  })
  app.listen(3000, function () {
    console.log('Side Runner listening on port 3000!')
  })
