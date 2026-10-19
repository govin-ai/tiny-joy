"""Local-only fault injection server. Never included in dist/deployment."""
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs
ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        request = urlparse(self.path)
        mode = parse_qs(request.query).get('fault',[''])[0]
        if request.path == '/' and mode in ('read','write','corrupt','future','copy'):
            setups = {
                'read': "Object.defineProperty(window,'localStorage',{get(){throw Error('QA blocked')}});",
                'write': "Storage.prototype.setItem=function(){throw Error('QA quota')};",
                'corrupt': "localStorage.setItem('fun-house:favorites:v1','{');",
                'future': "localStorage.setItem('fun-house:favorites:v1',JSON.stringify({schemaVersion:3,ids:['j1']}));",
                'copy': "Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('QA denied')}}});"
            }
            page=(ROOT/'index.html').read_text().replace('<script type="module"', '<script>'+setups[mode]+'</script><script type="module"')
            data=page.encode();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        else: super().do_GET()
HTTPServer(('127.0.0.1',4174),Handler).serve_forever()
