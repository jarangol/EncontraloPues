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
            codigoQR : new mongoose.Schema({
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
        {$push: {'lugar.puntosRecoleccion.$.objetosPerdidos': {
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
          if (err) res.send(err);
          res.send(valor.sequence_value);
        });
      })
});

app.post('/api/registrarObjetoPerdidoQR',function(req,res){

  fecha = new Date();

  persona.findOne({usuario : {$exists: true },
    'usuario.objetosPersonales.codigoQR' : req.body.codigoQR},
    function (err, cuenta) {
      if (cuenta){
        persona.aggregate(
          {$match : {lugar : {$exists: true }}},
          {$unwind : '$lugar.puntosRecoleccion'},
          {$unwind : '$lugar.puntosRecoleccion.objetosPerdidos'},
          {$match : {'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR' : req.body.codigoQR}},
          {$project : { 'nombre' : 1, "lugar.puntosRecoleccion.nombre":1}},
          function(err,lugarObjetoPerdido){
            if (!lugarObjetoPerdido.length){
              incrementarValor('codigoBusqueda',function (err1,codigoBusqueda) {
                incrementarValor('codigoRetiro',function (err2,codigoRetiro) {
                  persona.findOneAndUpdate(
                    {correoElectronico : req.body.correoLugar,
                      'lugar.puntosRecoleccion.nombre': req.body.nombrePunto},
                      {$push: {'lugar.puntosRecoleccion.$.objetosPerdidos': {
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
                        res.send("Registro Exitoso \n" +
                        "Codigo de Busqueda del objeto: " + codigoBusqueda.sequence_value);
                      });
                    })
                  })
                }else{
                  lugarObjetoPerdido = lugarObjetoPerdido[0];
                res.send("El Objeto ya esta registrado como perdido" +
                "\n Nombre del Lugar: " + lugarObjetoPerdido.nombre +
                "\n Nombre del Punto de Recoleccion: " + lugarObjetoPerdido.lugar.puntosRecoleccion.nombre);
                }
              });
            }else{
              res.send("No se encuentra el codigo QR");
            }
          })
});

app.post('/api/consultarObjetosPerdidosUsuario',function(req,res){
  consultaNombreLugar = {};
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if(req.body.nombreLugar) consultaNombreLugar = {nombre : req.body.nombreLugar};
  if(req.body.codigoBusqueda) consultaCodigoBusqueda = {'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda' : req.body.codigoBusqueda};
  if(req.body.tags) consultaTags = {'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags' : {$in : req.body.tags}};

  persona.aggregate(
    {$match : {lugar : {$exists: true }}},
    {$unwind : "$lugar.puntosRecoleccion" },
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año":req.body.añoRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes":req.body.mesRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.codigoQR":{$exists:false}},
      consultaNombreLugar,
      consultaCodigoBusqueda,
      consultaTags]}},
    {$project: {nombre:1,
        'lugar.puntosRecoleccion.nombre':1,
        'lugar.puntosRecoleccion.telefono':1,
        'lugar.puntosRecoleccion.direccion':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes':1}},
      function(err,objetosPerdidos){
        res.send(objetosPerdidos);
      })
});

app.post('/api/consultarObjetosPerdidosTrabajador',function(req,res){

  persona.aggregate(
    {$match : {correoElectronico : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año":req.body.añoRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes":req.body.mesRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda" : req.body.codigoBusqueda}]}},
    {$project: { nombre :1,
        'lugar.puntosRecoleccion.nombre':1,
        'lugar.puntosRecoleccion.telefono':1,
        'lugar.puntosRecoleccion.direccion':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoQR':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.dia':1}},
      function(err,objetosPerdidos){

        if(!objetosPerdidos.length) res.send(objetosPerdidos);

        if(objetosPerdidos[0].lugar.puntosRecoleccion.objetosPerdidos.codigoQR){
          res.send("El objeto se registro escaneando su codigoQR");
        }else{
          res.send(objetosPerdidos[0]);
        }
      })
});

app.post('/api/consultarObjetosPerdidosLugar',function(req,res){
  consultaNombrePuntoRecoleccion = {};
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if(req.body.nombrePuntoRecoleccion) consultaNombrePuntoRecoleccion = {'lugar.puntoRecoleccion.nombre' : req.body.nombrePuntoRecoleccion};
  if(req.body.codigoBusqueda) consultaCodigoBusqueda = {'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda' : req.body.codigoBusqueda};
  if(req.body.tags) consultaTags = {'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags' : {$in : req.body.tags}};

  persona.aggregate(
    {$match : {correoElectronico : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año":req.body.añoRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes":req.body.mesRegistro},
      consultaNombrePuntoRecoleccion,
      consultaCodigoBusqueda,
      consultaTags]}},
    {$lookup: {
              "from": "personas",
              "localField": "lugar.puntosRecoleccion.objetosPerdidos.codigoQR.correoUsuario",
              "foreignField": "correoElectronico",
              "as": "lugar.puntosRecoleccion.objetosPerdidos.codigoQR.usuario"}},
    {$lookup: { "from": "personas",
                "localField": "lugar.puntosRecoleccion.objetosPerdidos.correoTrabajadorRegistro",
                "foreignField": "correoElectronico",
                "as": "lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro"}},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos.codigoQR.usuario"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro"},
    {$project: { nombre : 1,
        'lugar.puntosRecoleccion.nombre':1,
        'lugar.puntosRecoleccion.telefono':1,
        'lugar.puntosRecoleccion.direccion':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
        'lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro.nombre':1,
        'lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro.trabajador.numeroId':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.usuario.correoElectronico':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.usuario.nombre':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.usuario.usuario.celular':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.año':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.mes':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.dia':1}},
        function(err,objetosPerdidos){
            res.send(objetosPerdidos);
        })
});

app.post('/api/retirarObjetoPerdido',function(req,res){

  persona.aggregate(
    {$match : {correoElectronico : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda" : req.body.codigoBusqueda},{
      "lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR":{$exists:true}}]}},
    {$project: {
      'lugar.puntosRecoleccion.nombre' : 1,
      'lugar.puntosRecoleccion.objetosPerdidos' : 1}},
    function(err,objetoPerdido){
      if (objetoPerdido.length) {
        objetoPerdido = objetoPerdido[0].lugar.puntosRecoleccion;
        if (objetoPerdido.nombre == req.body.nombrePunto) {
          fecha = new Date();
          objetoPerdido = objetoPerdido.objetosPerdidos;
          objetoPerdido.retirado = {
            correoTrabajadorRetiro : req.body.correoTrabajador,
            fechaRetiro : {
              año: fecha.getFullYear(),
              mes: fecha.getMonth(),
              dia: fecha.getDate()
            },
            personaReclamo : {
              numeroId : req.body.numeroIdPersona,
              nombre : req.body.nombrePersona,
              celular : req.body.celularPersona
            }
          };
          persona.findOneAndUpdate({correoElectronico : req.body.correoLugar,
            "lugar.puntosRecoleccion.nombre":req.body.nombrePunto},
            {$push:{"lugar.puntosRecoleccion.$.objetosRetirados" : objetoPerdido},
            $pull:{"lugar.puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda:req.body.codigoBusqueda}}},function(){});
            res.send("El objeto fue retirado Exitosamente");
          }else{
            res.send("El objeto se encuentra en el punto de Recoleccion: " + objetoPerdido.nombre);
          }
        }else{
          res.send("El objeto ya fue retirado");
        }
      })
});

app.post('/api/retirarObjetoPerdidoQR',function(req,res){

  persona.aggregate(
    {$match : {correoElectronico : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {"lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR" : req.body.codigoQR}},
    {$project: {
      'lugar.puntosRecoleccion.nombre' : 1,
      'lugar.puntosRecoleccion.objetosPerdidos' : 1}},
    function(err,objetoPerdido){
      if (objetoPerdido.length) {
        objetoPerdido = objetoPerdido[0].lugar.puntosRecoleccion;
        if (objetoPerdido.nombre == req.body.nombrePunto) {
          objetoPerdido = objetoPerdido.objetosPerdidos;
          if (objetoPerdido.codigoQR.codigoRetiro == req.body.codigoQR){
            fecha = new Date();
            objetoPerdido.retirado = {
              correoTrabajadorRetiro : req.body.correoTrabajador,
              fechaRetiro : {
                año: fecha.getFullYear(),
                mes: fecha.getMonth(),
                dia: fecha.getDate()
              }
            };
            persona.findOneAndUpdate({correoElectronico : req.body.correoLugar,
              "lugar.puntosRecoleccion.nombre":req.body.nombrePunto},
              {$push:{"lugar.puntosRecoleccion.$.objetosRetirados" : objetoPerdido},
              $pull:{"lugar.puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda:req.body.codigoBusqueda}}},function(){});
              res.send("El objeto fue retirado Exitosamente");
            }else{
              res.send("El codigo de retiro es incorrecto");
            }
          }else{
            res.send("El objeto se encuentra en el punto de Recoleccion: " + objetoPerdido.nombre);
          }
        }else{
          res.send("El codigo QR no esta registrado en EncontraloPues");
        }
    })

})

var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(8080);
console.log("App listening on port 8080");
