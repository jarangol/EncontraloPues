// Set up

var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


//Schema
var usuariosSchema = new mongoose.Schema({
  correoElectronico : String,
  contraseña : String,
  nombre : String,
  celular : String,
  objetosPersonales : [
    {
      codigoQR : String,
      tags: [],
      notificaciones: []
    }
  ],
  trabajadoresActuales:[
    {
      correoElectronico : String,
      contraseña : String,
      nombre : String,
      numeroId : String
    }
  ],
  puntosRecoleccion : [
     {
        nombre : String,
        telefono : String,
        direccion : String,
        objetosRegistrados : [
           {
             //_id : false,
             codigoBusqueda : Number,
             codigoRetiro : Number,
             tags : [],
             descripcionOculta : String,
             fechaRegistro : {
               año : String,
               mes : String,
               dia : String
             },
             usuarioDueño : {
               correoElectronico : String,
               nombre : String,
               celular : String
             },
             nombreTrabajador : String,
             idTrabajador : String
           }
        ]
     }
  ]
});

var contadoresSchema = new mongoose.Schema({
    _id : String,
    seq : Number,
    sequence_value : Number
});

contadoresSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

//Model
var usuario = mongoose.model('usuarios',usuariosSchema);
var contador = mongoose.model('contadores',contadoresSchema);

//Function
function incrementarValor (sequenceName){

   contador.findOneAndUpdate(
    {_id: sequenceName},
    {$inc:{sequence_value:1}},
    {new:true},
    function(err, valor){
        return valor.sequence_value;
    }
  );
}

app.get('/api/registros1', function(req, res) {
 
        console.log("fetching registros");
 
        // use mongoose to get all reviews in the database
        usuario.find(function(err, usuarios) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(usuarios); // return all reviews in JSON format
        });
    });

app.post('/api/registros',function(req,res){

  fecha = new Date();

  codBus = contador.findOneAndUpdate(
   {_id: "codigoBusqueda"},
   {$inc:{sequence_value:1}},
   {new:true}).exec()

   codBus.then(function(codigo){
     usuario.update({correoElectronico:
       "a",'puntosRecoleccion.nombre':"a"},
       {$push: {'puntosRecoleccion.0.objetosRegistrados':{
         codigoBusqueda: codigo.sequence_value,
         tags:req.body.tags,
         descripcionOculta:req.body.descripcionOculta,
         fechaRegistro:{
           año: fecha.getFullYear().toString(),
           mes: fecha.getMonth().toString(),
           dia: fecha.getDate().toString()
         },
         nombreTrabajador:1,
         idTrabajador:1
       }}},
       function(err,usuarios){
         if(err) res.send(err);
         res.send("updated");
       });
     })
   });
//




var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(8080);
    console.log("App server1 listening on port 8080");
