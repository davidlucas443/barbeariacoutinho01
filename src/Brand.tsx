export function Emblem(){return <img className="emblem official-logo" src="/logo-coutinho.svg" alt="Barbearia Coutinho" width="200" height="200"/>;}
export function Brand({full=false}:{full?:boolean}){
 return <a href="#inicio" className={`brand ${full?'brand-full':'brand-compact'}`} aria-label="Coutinho, início">{full?<Emblem/>:<><img className="compact-logo" src="/logo-compacto.svg" alt="" width="32" height="32"/><span>Coutinho<small>Desde 2014</small></span></>}</a>;
}
