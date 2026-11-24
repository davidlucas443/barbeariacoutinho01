export function Emblem(){return <span className="official-mark"><img className="official-logo" src="/logo-oficial.png" alt="Barbearia Coutinho" width="1080" height="1120"/></span>;}
export function Brand({full=false}:{full?:boolean}){
 return <a href="#inicio" className={`brand ${full?'brand-full':'brand-compact'}`} aria-label="Coutinho, início"><Emblem/></a>;
}
