export type Coordinates = { latitude: number; longitude: number };
export type Unit = {
  name: string; district: string; address: string; hours: string;
  coordinates: Coordinates | null; locationConfirmed: boolean;
  googleMapsUrl: string; googlePlaceId: string; confirmationSource: string;
  approximateArea: string;
};
export const config = {
  whatsapp: 'https://wa.me/5511948716883',
  instagram: 'barbeariacoutinho01',
  messages: {
    course: 'Olá, Coutinho! Quero conhecer o curso de barbeiro e consultar as próximas turmas.',
    cut: 'Olá, Coutinho! Quero agendar um corte. Quais horários estão disponíveis?',
    unitCut: 'Olá! Gostaria de agendar um corte na {unit} — {district}.',
  },
  course: { duration: '', hours: '', content: [] as string[], price: '', dates: '' },
  units: [
    { name: 'Unidade I', district: 'Recanto Campo Belo', address: '', hours: '', coordinates: null, locationConfirmed: false, googleMapsUrl: '', googlePlaceId: '', confirmationSource: '', approximateArea: 'Recanto Campo Belo, São Paulo, SP' },
    { name: 'Unidade II', district: 'Nora Ney – Socorro', address: '', hours: '', coordinates: null, locationConfirmed: false, googleMapsUrl: '', googlePlaceId: '', confirmationSource: '', approximateArea: 'Rua Nora Ney, Socorro, São Paulo, SP' },
  ] as Unit[],
  haircut: { front: '', profile: '', back: '' },
};
export const whatsappLink = (intent: keyof typeof config.messages) => `${config.whatsapp}?text=${encodeURIComponent(config.messages[intent])}`;
export const unitCutLink = (unit: Unit) => `${config.whatsapp}?text=${encodeURIComponent(config.messages.unitCut.replace('{unit}',unit.name).replace('{district}',unit.district))}`;
