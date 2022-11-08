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

exports.getMoods = async (req, res) => {
  const moodsList = await Mood.find({user_id: req.query.user_id})
  if (moodsList){
    res.status(200).send({message: moodsList})
  }
  return;
}

exports.deleteMoods = async (req, res) => {
    // TODO: accept an array
    console.log(req.body.id)
    await Mood.deleteOne(
        {id: req.body.id},
     )
    
     res.status(200).send({message: "Removed"})
}