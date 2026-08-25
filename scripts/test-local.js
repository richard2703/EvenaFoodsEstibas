require("dotenv").config();

if (!process.env.LOCAL_CHROME_PATH) {
  process.env.LOCAL_CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
}

var handler = require("../api/enviar-pedido.js");

var htmlPrueba =
  '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
  '<title>Prueba local</title></head><body style="font-family:Arial,sans-serif;padding:24px;">' +
  "<h1>Prueba local — Evena Foods</h1>" +
  "<p>Este PDF fue generado por scripts/test-local.js para probar el envío por correo.</p>" +
  "</body></html>";

var req = {
  method: "POST",
  body: {
    html: htmlPrueba,
    contactoNombre: "Prueba Local",
    contactoRazonSocial: "Evena Foods (test)",
    fecha: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })
  }
};

var res = {
  _status: 200,
  status: function (code) {
    this._status = code;
    return this;
  },
  json: function (payload) {
    console.log("STATUS:", this._status);
    console.log("BODY:", JSON.stringify(payload, null, 2));
  }
};

handler(req, res).catch(function (err) {
  console.error("ERROR NO CAPTURADO:", err);
  process.exit(1);
});
