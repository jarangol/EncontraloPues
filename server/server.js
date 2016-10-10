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


var personasSchema = new mongoose.Schema({
  correoElectronico : {type: String, index: {unique: true}},
  contraseña : String,
  nombre : String,
  usuario : new mongoose.Schema({
    celular : String,
    objetosPersonales : [
      {
        _id : false,
        codigoQR : String,
        tags : [String],
        disponible : Boolean,
        notificaciones : [
          {
            correoElectronicoLugar : String,
            nombrePuntoRecolecion : String,
            objetosCodigoBusqueda : Number,
            retirado : Boolean
          },
          {
            correoElectronicoUsuario : String,
            fechaRegistro : {
              año : Number,
              mes : Number,
              dia : Number
            }
          }
        ]
      }
    ]
  }),
  lugar : new mongoose.Schema({
    trabajadores : [String],
    puntosRecoleccion : [
      {
        _id : false,
        nombre : String,
        telefono : String,
        direccion : String,
        disponible : Boolean,
        objetosPerdidos : [
          {
            codigoBusqueda : Number,
            correoTrabajadorRegistro : String,
            fechaRegistro : {
              año : Number,
              mes : Number,
              dia : Number
            },
            sinCodigoQR : new mongoose.Schema({
              tags : [String],
              descripcionOculta : String
            }),
            codigoQR : new mongoose.Schema({
              correoUsuario : String,
              objetoPersonalCodigoQR : String,
              codigoRetiro : Number
            })
          }
        ],
        objetosRetirados : [
          {
            codigoBusqueda : Number,
            correoTrabajadorRegistro : String,
            fechaRegistro : {
              año : Number,
              mes : Number,
              dia : Number
            },
            sinCodigoQR : new mongoose.Schema({
              tags : [String],
              descripcionOculta : String
            }),
            CodigoQR : new mongoose.Schema({
              correoUsuario : String,
              objetoPersonalCodigoQR : String,
              codigoRetiro : Number,
            }),
            retirado : new mongoose.Schema({
              correoTrabajadorRetiro : String,
              fechaRetiro : {
                año : Number,
                mes : Number,
                dia : Number
              },
              personaReclamo : new mongoose.Schema({
                numeroId : String,
                nombre : String,
                celular : String
              }),
              donado : new mongoose.Schema({
                fechaDonado : {
                  año : Number,
                  mes : Number,
                  dia : Number
                }
              })
            })
          }
        ]
      }
    ]
  }),
  trabajador : new mongoose.Schema({
    numeroId : Number
  })
});

var contadoresSchema = new mongoose.Schema({
  _id : String,
  seq : Number,
  sequence_value : Number
});

//Model
var persona = mongoose.model('personas',personasSchema);
var contador = mongoose.model('contadores',contadoresSchema);

//Function
function incrementarValor (sequenceName, callback){
  contador.findOneAndUpdate(
      {_id: sequenceName},
      {$inc:{sequence_value:1}},
      {new:true},
      callback
    );
  }

// registrarUsuarioComun
app.post('/api/registrarUsuario',function(req,res){
  (new persona({
    correoElectronico : req.body.correoUsuario,
    contraseña : req.body.contraseña,
    nombre : req.body.nombre,
    usuario : {
      celular : req.body.celular,
      objetosPersonales : []
    }
  })).save(function (err,resu) {
    if (err) res.send(false);
    res.send(true);
  });
});

//registrarUsuarioLugar
app.post('/api/registrarLugar',function(req,res){
  (new persona({
    correoElectronico : req.body.correoLugar,
    contraseña : req.body.contraseña,
    nombre : req.body.nombre,
    lugar : {
      trabajadoresActuales : [],
      puntosRecoleccion : []
    }
  })).save(function (err,resu) {
    if (err) res.send(false);
    res.send(true);
  });
});

app.post('/api/registrarTrabajador',function(req,res){
  (new persona({
    correoElectronico : req.body.correoTrabajador,
    contraseña : req.body.contraseña,
    nombre : req.body.nombre,
    trabajador : {
      numeroId : req.body.numeroId,
    }
  })).save(function (err,resu) {
    if (err) res.send(false);
    persona.findOneAndUpdate({correoElectronico: req.body.correoLugar},
      {$push: {"lugar.trabajadores" : req.body.correoTrabajador}},
      function(err,doc) {
        if (err) res.send(false);
        res.send(true);
      });
    });
  });

  app.post('/api/registrarObjetoPersonal',function(req,res){
    persona.findOneAndUpdate(
      {correoElectronico: req.body.correoUsuario},
      {$push : {
        "usuario.objetosPersonales" : {
          codigoQR : mongoose.Types.ObjectId(),
          tags : req.body.arregloTags,
          disponible : true,
          notificaciones:[] }
        }
      },
      function(err,doc) {
        if (err) res.send(false);
        res.send(true);
      });
    });

    app.post('/api/registrarPuntoRecoleccion',function(req,res){
      persona.findOneAndUpdate(
        {correoElectronico: req.body.correoLugar},
        {$push: {
          "lugar.puntosRecoleccion": {
            nombre:req.body.nombre,
            telefono:req.body.telefono,
            direccion:req.body.direccion,
            disponible : true,
            objetos:[] }
          }
        },
        function(err,doc) {
          if (err) res.send(false);
          res.send(true);
        })
      });

      app.post('/api/registrarObjetoPerdido',function(req,res){

        fecha = new Date();

        incrementarValor('codigoBusqueda',function (err,valor) {
          persona.findOneAndUpdate(
            {correoElectronico : req.body.correoLugar,
              'lugar.puntosRecoleccion.nombre': req.body.nombrePunto},
              {$push: {'lugar.puntosRecoleccion.0.objetosPerdidos': {
                codigoBusqueda : valor.sequence_value,
                correoTrabajadorRegistro : req.body.correoTrabajador,
                fechaRegistro : {
                  año: fecha.getFullYear(),
                  mes: fecha.getMonth(),
                  dia: fecha.getDate()
                },
                sinCodigoQR : {
                  tags : req.body.tags,
                  descripcionOculta : req.body.descripcionOculta
                }
              }}},
              function(err,doc) {
                if (err) res.send(false);
                res.send(true);
              });
            })
          });



          app.post('/api/registrarObjetoPerdidoQR',function(req,res){

            fecha = new Date();

            persona.findOne({usuario : {$exists: true },
              'usuario.objetosPersonales.codigoQR' : req.body.codigoQR},
              function (err, cuenta) {
                if (cuenta){
                  persona.findOne({lugar : {$exists: true },
                    'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR': req.body.codigoQR},
                  function(err,lugarObjetoPerdido){
                    if (!lugarObjetoPerdido){
                      incrementarValor('codigoBusqueda',function (err1,codigoBusqueda) {
                        incrementarValor('codigoRetiro',function (err2,codigoRetiro) {
                          persona.findOneAndUpdate(
                            {correoElectronico : req.body.correoLugar,
                              'lugar.puntosRecoleccion.nombre': req.body.nombrePunto},
                              {$push: {'lugar.puntosRecoleccion.0.objetosPerdidos': {
                                codigoBusqueda : codigoBusqueda.sequence_value,
                                correoTrabajadorRegistro : req.body.correoTrabajador,
                                fechaRegistro : {
                                  año: fecha.getFullYear(),
                                  mes: fecha.getMonth(),
                                  dia: fecha.getDate()
                                },
                                codigoQR : {
                                  correoUsuario : cuenta.correoElectronico,
                                  objetoPersonalCodigoQR : req.body.codigoQR,
                                  codigoRetiro : codigoRetiro.sequence_value
                                }
                              }}},
                              function(err,doc) {
                                if (err) res.send("Ya se encuentra el objeto");
                                res.send(true);
                              });
                            })
                          })
                        }else{
                          // AGRUPGAR ESTAS RETURN
                          res.send(lugarObjetoPerdido.nombre);
                          res.send(lugarObjetoPerdido.lugar.puntosRecoleccion.nombre);
                        }
                        });
                      }else{
                        res.send("No se encuentra el codigo QR");
                      }
                    })
                  });

      app.get('/api/prueba',function(req,res){
        persona.find({}, function (err, docs) {
          res.send(docs);
        });
      });

      var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';
      mongoose.connect(mongodbUri);

      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));

      app.listen(8080);
      console.log("App listening on port 8080");

