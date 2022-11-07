exports.allAccess = (req, res) => {
  res.status(200).send({msg: "Public Content."});
};

exports.userBoard = (req, res) => {
  res.status(200).send({msg: "User Content."});
};

exports.adminBoard = (req, res) => {
  res.status(200).send({msg: "Admin Content."});
};
