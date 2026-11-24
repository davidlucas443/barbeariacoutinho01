import type { Coordinates, Unit } from './config';
export function hasCoordinates(unit: Unit): boolean {
 const c=unit.coordinates;
 return unit.locationConfirmed && !!c && Number.isFinite(c.latitude) && Number.isFinite(c.longitude) && Math.abs(c.latitude)<=90 && Math.abs(c.longitude)<=180;
}
export function routeLink(unit: Unit): string | null {
 if(!unit.locationConfirmed || !unit.confirmationSource || !unit.address.trim() || !(unit.googleMapsUrl || unit.googlePlaceId))return null;
 const destination=hasCoordinates(unit)?`${unit.coordinates!.latitude},${unit.coordinates!.longitude}`:unit.address;
 const params=new URLSearchParams({api:'1',destination});
 if(unit.googlePlaceId)params.set('destination_place_id',unit.googlePlaceId);
 return `https://www.google.com/maps/dir/?${params}`;
}
export function areaLink(unit: Unit): string {
 return `https://www.google.com/maps/search/?${new URLSearchParams({api:'1',query:unit.approximateArea})}`;
}
export function distanceKm(a: Coordinates,b: Coordinates): number {
 const rad=(degrees:number)=>degrees*Math.PI/180;
 const lat=rad(b.latitude-a.latitude),lon=rad(b.longitude-a.longitude);
 const h=Math.sin(lat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(lon/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
