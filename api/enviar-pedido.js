var puppeteer = require("puppeteer-core");
var chromium  = require("@sparticuz/chromium");
var nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  var body = req.body || {};
  var html = body.html;
  var contactoNombre = (body.contactoNombre || "").trim();
  var contactoRazonSocial = (body.contactoRazonSocial || "").trim();
  var fecha = body.fecha || "";

  if (!html || !contactoNombre || !contactoRazonSocial) {
    res.status(400).json({ error: "Faltan datos: html, contactoNombre o contactoRazonSocial" });
    return;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.PEDIDOS_EMAIL_TO) {
    res.status(500).json({ error: "Faltan variables de entorno GMAIL_USER, GMAIL_APP_PASSWORD o PEDIDOS_EMAIL_TO" });
    return;
  }

  var browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    var pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" }
    });
    await browser.close();
    browser = null;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    var fileName = "Plan-Tarimas-" + (fecha || new Date().toISOString().slice(0, 10)).replace(/\s+/g, "-") + ".pdf";

    await transporter.sendMail({
      from: '"Evena Foods" <' + process.env.GMAIL_USER + ">",
      to: process.env.PEDIDOS_EMAIL_TO,
      subject: "Plan de armado de tarimas — " + contactoRazonSocial + " (" + contactoNombre + ")",
      text: "Se adjunta el plan de armado de tarimas.\n\nContacto: " + contactoNombre + "\nRazón social: " + contactoRazonSocial + "\nFecha: " + fecha,
      attachments: [
        { filename: fileName, content: pdfBuffer, contentType: "application/pdf" }
      ]
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    console.error(err);
    res.status(500).json({ error: "No se pudo generar o enviar el PDF", detail: String((err && err.message) || err) });
  }
};
