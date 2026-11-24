import { defineConfig, type Plugin } from 'vite';

// Match only /bio: the home page and static assets retain their normal handlers.
const bioRoute:Plugin={
 name:'bio-html-route',
 configureServer(server){server.middlewares.use((req,_res,next)=>{if(req.url?.split('?')[0]==='/bio')req.url=req.url.replace('/bio','/bio/index.html');next();});},
 configurePreviewServer(server){server.middlewares.use((req,_res,next)=>{if(req.url?.split('?')[0]==='/bio')req.url=req.url.replace('/bio','/bio/index.html');next();});},
};
export default defineConfig({
 plugins:[bioRoute],
 build:{rollupOptions:{input:{main:'index.html',bio:'bio/index.html'}}},
});
