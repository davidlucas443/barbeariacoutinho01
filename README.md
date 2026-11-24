# Barbearia Coutinho | Escola de Barbeiro

Landing page mobile-first em React, TypeScript e Vite, sem backend ou banco de dados.

## Rodar e validar

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
```

Servidor: http://127.0.0.1:5173. Build estático em `dist/`. Testes Playwright usam Google Chrome instalado.

## Funcionalidades

- Abertura tipográfica em preto e branco, com curso como ação principal e WhatsApp para corte.
- Barber pole à direita do texto também no celular, com botões abaixo da composição.
- Estrutura cromada sem suporte de parede, vidro fixo e cilindro helicoidal em loop CSS de 2 segundos.
- Textura projetada uma vez com arco seno para comprimir as faixas nas bordas. Sem loop JavaScript de renderização.
- GSAP e ScrollTrigger revelam +100 alunos na escola. Lenis usa o relógio do GSAP no desktop; celular mantém scroll natural.
- Movimento reduzido mantém o conteúdo e o poste estáticos. Não há faixa decorativa junto ao título ou na passagem para a escola.
- Duas unidades com agendamento por WhatsApp, incluindo o nome da unidade na mensagem.

## Configuração

Edite `src/config.ts`:

- `whatsapp`, `instagram`, `messages.course`, `messages.cut`, `messages.unitCut`: contatos e mensagens.
- `course.duration`, `hours`, `content`, `price`, `dates`: dados confirmados do curso; vazios não aparecem.
- `units`: nome, bairro, endereço, horário, coordenadas e destinos do Maps.
- `haircut.front`, `profile`, `back`: ilustrações opcionais do mesmo corte. A galeria fica oculta até as três imagens carregarem. Inclui controles, teclado e deslize horizontal com scroll vertical preservado.

### Localização

Os endereços reais ainda não foram confirmados. Os cards mostram uma busca pela região e o agendamento, sem apresentar coordenadas inventadas como lojas.

Para habilitar “Traçar rota”, preencha por unidade `address`, `coordinates`, `confirmationSource`, `googlePlaceId` ou `googleMapsUrl` e marque `locationConfirmed: true` após confirmação.

“Ver unidade mais próxima” aparece quando ambas têm destinos confirmados. Só solicita localização após toque e calcula distância em linha reta no navegador, sem armazenar ou enviar a posição. Permissão negada e indisponibilidade mantêm escolha manual. Requer HTTPS ou localhost.

Links seguem a documentação: https://developers.google.com/maps/documentation/urls/get-started. Sem chave de API.

## Identidade e assets

- `public/logo-compacto.svg`: emblema compacto com bigode e contorno ondulado.
- `public/logo-coutinho.svg`: versão completa recriada da fachada; tipografia aproximada.
- `public/favicon.svg`: bigode.
- `public/images/barber-pole-standalone.png`: asset ativo, gerado/editado com image_gen a partir da referência, sem suporte. `src/BarberPole.tsx` e `src/style.css` compõem cilindro, cromado e vidro.
- `public/images/barber-pole-structure.png`: versão anterior com suporte, mantida como histórico.
- `referencias/`: imagens de referência do projeto.

Faltam dados confirmados de curso, endereços e horários, além das três ilustrações opcionais do degradê. Não há depoimentos fictícios.

## Evidências

Capturas atuais em `artifacts/pole-sem-suporte/`: abertura 390 px, desktop e páginas em 360, 390 e 1440 px. Outras pastas guardam versões anteriores, incluindo a gravação `artifacts/pole-realista/dois-ciclos.webm`, que mostra o poste antigo com suporte.

A suíte verifica navegação ao curso, WhatsApp por intenção/unidade, layout, movimento reduzido, continuidade do ciclo e geolocalização com dados sintéticos apenas nos testes. Testes de toque usam emulação; validação em aparelho físico continua pendente.

A gravação opcional em `tests/recording.spec.ts` requer `npx playwright install ffmpeg` e `RECORD_POLE=1`. Se usar `PLAYWRIGHT_BROWSERS_PATH`, use o mesmo caminho na instalação e execução. A suíte padrão pula essa gravação.

## Acabamento acetinado e logo oficial

O asset ativo do poste foi editado com image_gen para prata acetinada semi-ilustrada, preservando geometria e transparência. O vidro tem um reflexo discreto; as listras estão mais claras. O logo oficial fornecido em referencias/logo.png foi copiado sem redesenho para public/logo-oficial.png. O componente Brand recorta somente a margem externa via CSS, mantém a proporção e integra o preto com blend de tela. Largura: 56 px no celular e 64 px a partir de 600 px; texto alternativo Barbearia Coutinho. Capturas desta revisão em artifacts/pole-acetinado/.

## Ajuste mais recente

Poste cromado anterior restaurado, incluindo cores e reflexos do vidro. Logo oficial preservado no header, sem os textos adicionais Coutinho e Desde 2014. Capturas atuais: artifacts/pole-cromado-header/.

## Transições ligadas ao scroll

Referência de ritmo observada em celular e desktop: https://viudespratas.vercel.app/. A Coutinho mantém sua composição preta e branca. Em src/App.tsx, um wrapper estável #curso envolve o painel branco: o painel sobe 48 px no mobile e 96 px no desktop conforme o scroll, em conjunto com a revelação de +100. As passagens para Barbearia e Unidades usam apenas 14/26 px de deslocamento. ScrollTrigger usa scrub verdadeiro, sem fixação, e inverte o progresso ao voltar. Movimento reduzido mantém fluxo e posições estáticas.

Lenis continua apenas no desktop, no ticker do GSAP. Âncoras usam a posição absoluta do alvo com offset de 18 px, evitando disputa entre animação nativa e Lenis. No celular, navegação e gesto vertical permanecem nativos.

Vídeo mobile nos dois sentidos e acesso pelo botão: artifacts/transicoes/abertura-escola-390.webm. Testes em tests/transitions.spec.ts cobrem reversibilidade em 360/390/1440, âncoras e movimento reduzido. Para regravar, execute com RECORD_SCROLL=1 e FFmpeg instalado no caminho do Playwright.
