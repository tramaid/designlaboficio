// Servidor local para LAB/OFICIO. Sin dependencias, sin conexión a internet.
// Solo acepta conexiones desde esta computadora (127.0.0.1).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT || 8765);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch{res.writeHead(400).end('Solicitud inválida');return}
  const file = path.resolve(root,'.'+pathname,(pathname==='/'?'index.html':''));
  if(!file.startsWith(root+path.sep) && file!==path.join(root,'index.html')){res.writeHead(403).end('No permitido');return}
  fs.stat(file,(err,info)=>{
    if(err || !info.isFile()){res.writeHead(404).end('Archivo no encontrado');return}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
}).listen(port,'127.0.0.1',()=>{
  console.log('LAB/OFICIO iniciado en http://127.0.0.1:'+port+'/');
  console.log('Mantené esta ventana abierta durante el estudio. Ctrl+C para cerrar.');
}).on('error',err=>{console.error('No se pudo iniciar el servidor local:',err.message);process.exitCode=1});
