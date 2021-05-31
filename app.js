var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser")
//const https = require('https')
const axios = require('axios');
const {v4 : uuidv4} = require('uuid')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeRouter = require('./routes/home');
var getRouter  = require('./routes/get');
var postRouter  = require('./routes/post');
var deleteRouter  = require('./routes/delete');

require('dotenv').config()

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

axios.defaults.baseURL = process.env.HOSTNAME;
axios.defaults.headers.common['Authorization'] = process.env.AUTH_TOKEN;
axios.defaults.headers.common['x-api-key'] = process.env.XAPIKEY;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// view engine setup
//app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/get', getRouter);
app.use('/post', postRouter);
app.use('/delete', deleteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.post("/postvacc", function(req, res){
	console.log(req.body);

 var vaccineProcedure = req.body.vaccprocedure;

if (vaccineProcedure == "dose1")
 { 
  vaccineProcedureCode = "1324681000000101";
  vaccineProcedureDescription = "Administration of first dose of SARS-CoV-2 (severe acute respiratory syndrome coronavirus 2) vaccine";
} 
if (vaccineProcedure == "dose2")
 { 
  vaccineProcedureCode = "1324691000000104";
  vaccineProcedureDescription = "Administration of second dose of SARS-CoV-2 (severe acute respiratory syndrome coronavirus 2) vaccine";
} 

 var vaccineProduct = req.body.vaccine;

 if (vaccineProduct == "astrazeneca")
 { 
  vaccineProductCode = "39114911000001105";
  vaccineProductDescription = "COVID-19 Vaccine AstraZeneca (ChAdOx1 S [recombinant]) 5x10,000,000,000 viral particles/0.5ml dose solution for injection multidose vials (AstraZeneca)";
} 
 if (vaccineProduct == "pfizer")
 { 
  vaccineProductCode = "39115611000001103";
  vaccineProductDescription = "COVID-19 mRNA Vaccine Pfizer-BioNTech BNT162b2 30micrograms/0.3ml dose concentrate for suspension for injection multidose vials (Pfizer Ltd)";
} 
 if (vaccineProduct == "moderna")
 { 
  vaccineProductCode = "39326911000001101";
  vaccineProductDescription = "COVID-19 mRNA (nucleoside modified) Vaccine Moderna 0.1mg/0.5mL dose dispersion for injection multidose vials (Moderna, Inc)";
} 

var uuid = uuidv4();

 console.log("THE VACCINE CHOSEN IN UI IS " + vaccineProduct);
 console.log("vaccineProductCode " + vaccineProductCode);
 console.log("vaccineProductDescription " + vaccineProductDescription);
 console.log("indentifier UUID " + uuid);

const createVacc = async () => {
    try {
        const res = await axios.post('/dev/Immunization', 

{
  "resourceType": "Immunization",
  "meta": {
       "profile":  [
          "https://fhir.nhs.uk/StructureDefinition/NHSDigital-Immunization"
        ]
   },
  "extension": [ {
        "url": "https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-VaccinationProcedure",
        "valueCodeableConcept": {
          "coding": [ {
            "system": "http://snomed.info/sct",
            "code": vaccineProcedureCode,
            "display": vaccineProcedureDescription
          } ]
        }
      } ],
  "identifier": [
    {
      "system": "https://supplierABC/identifiers/vacc",
      "value": uuid
    }
  ],
  "status": "completed",
  "vaccineCode": {
  "coding": [
   {
     "system": "http://snomed.info/sct",
     "code": vaccineProductCode,
     "display": vaccineProductDescription
}
]
},
  "patient": {
    "reference": "Patient/example"
  },
  "encounter": {
    "reference": "Encounter/example"
  },
  "occurrenceDateTime": "2021-02-23T13:00:08.476+00:00",
  "primarySource": true,
  "location": {
    "reference": "Location/1"
  },
  "manufacturer": {
    "reference": "Organization/hl7"
  },
  "lotNumber": "AAJN11K",
  "expirationDate": "2021-06-23",
  "site": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "368208006",
        "display": "Left upper arm structure (body structure)"
      }
    ]
  },
  "route": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "78421000",
        "display": "Intramuscular route (qualifier value)"
      }
    ]
  },
  "doseQuantity": {
    "value": 0.5,
    "unit": "Millilitre",
    "system": "http://snomed.info/sct",
    "code": "258773002"
  },
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0443",
            "code": "OP"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/example"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0443",
            "code": "AP"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/example"
      }
    }
  ],
  "note": [
    {
      "text": "Notes on adminstration of vaccine"
    }
  ],
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "443684005",
          "display": "Disease outbreak (event)"
        }
      ]
    }
  ]
}
          );
        //console.log(res.data);
        global.newVaccId = res.data.id;
        console.log("newVaccId = " + global.newVaccId);
    } catch (err) {
        console.error(err);
    }
        res.render("postcreated", { newVaccId : global.newVaccId } );
};

createVacc();

});


app.get("/postcreated", function(req, res){
  console.log(req.body);
  res.render("postcreated");
});

        global.FHIRId                      = "";
        global.vaccineProcedureCode        = "";
        global.vaccineProcedureDescription = "";
        global.vaccineProductCode          = "";
        global.vaccineProductDescription   = "";


app.get("/getvacc", function(req, res){

const getvacc = async () => {
    try {
        var immunization_id = "";
        var immunization_id = req.query.immunizationid;
        console.log("The Immunization_Id is " + immunization_id );
        const res = await axios.get('/dev/Immunization/' + immunization_id );
        //console.log(res.data);
        global.FHIRId                      = res.data.id;
        global.vaccineProcedureCode        = res.data.extension[0].valueCodeableConcept.coding[0].code;
        global.vaccineProcedureDescription = res.data.extension[0].valueCodeableConcept.coding[0].display;
        global.vaccineProductCode          = res.data.vaccineCode.coding[0].code;
        global.vaccineProductDescription   = res.data.vaccineCode.coding[0].display;
    } catch (err) {
        console.error(err);
    }
};

 getvacc();

 //res.redirect("/getvacc");
 res.render("get", { vaccineProcedureDescription : global.vaccineProcedureDescription } );
});

app.delete('/delete', (req, res) => {
  /*
  res.render("delete");
  const {id} = req.params
  comments = comments.filter(c => c.id !== id)
  res.redirect('/comments')
  */
})

app.get("/deletevacc", function(req, res){

const deletevacc = async () => {
    try {
        var immunization_id = req.query.immunizationid;
        console.log("The Immunization_Id is " + immunization_id );
        const res = await axios.delete('/dev/Immunization/' + immunization_id );
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
};

 deletevacc();

res.render("deletevacc", { newVaccId : global.newVaccId } );
  //res.render("deletevacc", { newVaccId : global.newVaccId } );

});

app.listen(port, () => console.log("Server listening on port " + port ));