const Airtable = require('airtable')
const dotenv = require('dotenv').config()
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const companyTable = process.env.AIRTABLE_PROVIDERS_TABLE;
const machinesTable = process.env.AIRTABLE_MACHINES_TABLE;

exports.allAccess = (req, res) => {
  res.status(200).send({msg: "Public Content."});
};

exports.userBoard = (req, res) => {
  res.status(200).send({msg: "User Content."});
};

exports.adminBoard = (req, res) => {
  res.status(200).send({msg: "Admin Content."});
};

exports.providerProfile = async (req, res) => {
  const record_id = req.query.id
  const machine_table = base(machinesTable)
  const table = base(companyTable)
  //const machineRecords = machine_table.select({filterByFormula: `({Name} = "Illumina")`})
  //console.log("MACHINE")
  //console.log(machineRecords)
  const record = table.find(record_id, (err, record) => {
    if (err) { console.error(err); return; }
    console.log(record)
    res.status(200).send({msg: record})
    return record;
  });
};

"rec4DcVDAuuBSfb5r"

exports.updateProviderProfile = (req, res) => {
  console.log("POSTING")
  console.log(req.body)
  // Extract values from POST and add to fields
  base(companyTable).update("rec4DcVDAuuBSfb5r", req.body, (err, records) => {
    if (err) {
      console.error(err);
      res.status(500).send({msg: err})
      return;
    }
    res.status(200).send({msg: "Record updated successfully"})
  })

  /*
  base(companyTable).update([
    {
      "id": "rec4nLe66rIMYplCF",
      "fields": req.body
  }], (err, records) => {
    if (err) {
      console.error(err);
      res.status(500).send({msg: err})
      return;
    }
    res.status(200).send({msg: "Record updated successfully"})
  })
  */
  
};