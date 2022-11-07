const db = require("../models");
const Mood = db.mood;

exports.insertMood = (req, res) => {
  const newMood = new Mood({
    value: req.body.value,
    note: req.body.note,
    user_id: req.body.user_id
  });

  newMood.save((err, mood) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({message: mood})
    return;
  });
}

exports.getMoods = (req, res) => {
  const id = req.body.id
  const moodsList = Mood.find({user_id: id}).sort({time : -1}).limit(5000).toArray()
  if (err) {
    res.status(500).send({ message: err });
    return;
  }
  res.status(200).send({message: moodsList})
  return;
}
