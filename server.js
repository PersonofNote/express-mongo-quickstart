const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const Airtable = require('airtable')

// ENV VARIABLES
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AIRTABLE_TABLE_IDS = process.env.AIRTABLE_TABLE_IDS;

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE_ID);

const preLoadData = async() => {
  // Getting linked table data from Airtable is annoying, and temporary
  // This function preloads data that we want and maps it to an object for display while things are in flux

  const LINKED_DATA = {}
  LINKED_DATA.tissue_sample_names_by_id = {}
  LINKED_DATA.tissue_sample_ids_by_name = {}
  LINKED_DATA.tissue_sample_units = {}
  LINKED_DATA.providers = {}

  const tissue_sample_table = 'tbliGPwuWUq0KnIH4'
  const tissue_records = await base(tissue_sample_table).select().all();
  const units = await base('tbleziLQlCca64iAk').select().all();
  const providers_table = 'tbl8atXH48SRFZVBv'

  tissue_records.forEach(record => {
    id = record.id
    field_name = record.get('Tissue')
    LINKED_DATA.tissue_sample_names_by_id[id] = field_name
    LINKED_DATA.tissue_sample_ids_by_name[field_name] = id
});

  units.forEach(record => {
    tissue_name = record.get('Name')
    tissue_unit = record.get('Unit')
    LINKED_DATA.tissue_sample_units[tissue_name] = tissue_unit
  })

  provider_records = await base(providers_table).select().all();
  provider_records.forEach(record => {
    id = record.id
    provider_name = record.get('Name')
    logo = record.get('DX co Logo')
    url = record.get('Website')
    LINKED_DATA.providers[id] = {
      "name": provider_name,
      "logo": logo,
      "url": url
    }
  })

  return LINKED_DATA
}



app.get("/", (req, res) => {
  res.json({ message: "Welcome to A Minor Studio's express base app with authentication" });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/tissueData.routes')(app);



const PORT = process.env.PORT || 8080;

preLoadData().then((result)=>{
  const airtable_data = result
  console.log("🟢 App online 🟢")
  console.log("Preloaded data:")
  console.log(airtable_data)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
});