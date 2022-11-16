const Airtable = require('airtable')
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

const insertTissueSample = (data) => {
    console.log("Inserting into airtable")
}

const getDataTypeBySampleType = async(table, types) => {
    // TODO: Improve filtering to include sample minimums and cli data and so on
    const list = []
    try{
    // TODO: add pagination? Check if table will get much bigger, but I think it is a fixed length
    const records = await base(table).select().all();
  
    records.forEach(record => {
      if (record.fields['Sample Type']){
        let rField = record.fields['Sample Type']
        if (typeof(rField) === 'string') {
          rField = rField.split(",")
        }
        if (rField.some(item => types.includes(item))) {
          list.push(record)
        }
      }
    });
    return list
  }catch(error){
    console.log(error)
    return error
  }
}

exports.processTissueData = (req, res) => {
    const tissueType = req.body.tissueType;
    insertTissueSample()
    getDataTypeBySampleType('tbl9mBFgW23Si1zEp', tissueType).then((result) => {
    res.send({data:result})
   })
}