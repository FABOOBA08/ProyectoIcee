const express = require("express");
const mysql = require("mysql");
const app = express();
/* conexión a la base de datos */
let conexion = mysql.createConnection({
  host: "localhost",
  database: "proyecto_icee",
  user: "root",
  password: "",
  port: 8085,
});
/* Se manejan datos desde otras páginas o ubicación */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/usuarios.html");
});
/* Se direcciona a la ruta validar que es el formulario de registro para pasar los datos por el servidor antes de a la b */
app.post("/validar", function (req, res) {
  /*Variables donde se guardan los datos que se capturan desde el formulario */
  const datosU = req.body;
  let id = datosU.id;
  let nombre = datosU.nombre;
  let contrasena = datosU.contrasena;
  let nombreUsuario = datosU.nombreUsuario;
  let rol = datosU.rol;
  /* Query para insertar los datos */
  let registroU =
    "INSERT INTO usuarios (id,nombre,contrasena,rol,nombreUsuario) VALUES ('" +
    id +
    "', '" +
    nombre +
    "', '" +
    contrasena +
    "', '" +
    rol +
    "', '" +
    nombreUsuario +
    "')";
  conexion.query(registroU, function (error) {
    if (error) {
      throw error;
    } else {
      res.send(
        '<script>alert("Usuario agregado con éxito"); window.location="/";</script>'
      );
      console.log("Vamos por el camino del bien si se puede");
    }
  });
});
app.get("/consultar", function (req, res) {
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) throw err;
    res.render("consultar", { usuarios: result }); // Renderizar el archivo usuarios.ejs y pasar los datos como contexto
  });
});

conexion.connect(function (err) {
  if (err) throw err;
  //Select all customers and return the result object:
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


// Agrega esta ruta para manejar la solicitud de obtener usuarios
app.get("/obtener-usuarios", function (req, res) {
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) {
      res.status(500).send("Error al obtener usuarios");
      return;
    }
    res.json(result);
  });
});





app.listen(3000, function () {
  console.log("Servidor creado http://localhost:3000");
});
