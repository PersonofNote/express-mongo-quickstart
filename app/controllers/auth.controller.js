const config = require("../config/auth.config");
const Airtable = require('airtable')
const dotenv = require('dotenv').config()
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const providerTable = process.env.AIRTABLE_PROVIDERS_TABLE;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const newProvider = {
    name: req.body.companyName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  };
  base(providerTable).create([
    {
      "fields": {
        "Name": newProvider.name,
        "DX co Name": newProvider.name,
        "Email": newProvider.email,
        "encrypted_password": newProvider.password
      }
    }
  ], (err,records) => {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(record => {
      console.log(record.getId());
    });
  });
  res.status(200).send({msg: "You have successfully registered, and can now log in"});
};

exports.signin = (req, res) => {
  // TODO: See if there's a cleaner way of doing this/targeting one element
  base(providerTable).select({filterByFormula: `{Name} = "${req.body.companyName}"`}).firstPage((err, records) => {
    if (err) { console.error(err); res.status(400).send({msg: "Could not find company"}); }
    records.forEach(record => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        record.get('encrypted_password')
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      const recordId = record.get('record_id')
      let token = jwt.sign({ id: recordId }, config.secret, {
        expiresIn: 86400
      });
      const companyData = {
        companyName: record.get('Name'),
        companyId: recordId,
        accessToken: token
      }
      console.log(companyData)
      res.status(200).send({msg: companyData});
  });
});
};