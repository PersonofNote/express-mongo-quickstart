const controller = require("../controllers/mood.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // TODO: call pagination middleware
  app.get(
    "/api/moods",
    controller.getMoods
  );

  app.post(
    "/api/moods",
    controller.insertMood
  );

};
