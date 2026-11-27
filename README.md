# RobotYard

O estaleiro onde os agentes são construídos, cuidados e lançados.

Um produto sobre a base do Timon: app web de nível desktop, invólucro desktop, servidor como
monolito modular com dois pontos de entrada (gateway HTTP e daemon), e um sistema de plugins
que dá a cada bot um callsign e uma cabeça.

## Estrutura

```
apps/web        React + Vite + TanStack Router (a chegar)
apps/server     o servidor: src/gateway e src/daemon, dois pontos de entrada, um app
packages/       contracts, ui, e os pacotes que as fronteiras exigirem
tools/          verificações que provam fronteira, não que a documentam
```

## Fronteira entre gateway e daemon

`tsconfig.gateway.json` e `tsconfig.daemon.json` listam fontes disjuntas com `composite: true`.
Um import na direção errada não compila: falha com TS6307.
`bun run boundary` prova isso criando um import proibido de propósito e exigindo a falha.

## Verificação

```sh
bun install
bun run typecheck && bun run lint && bun run test && bun run build
bun run boundary
```

A CI roda exatamente esses comandos, mais uma sonda de pseudo-terminal no Windows que decide
se o processo de terminal precisa continuar em Node naquela plataforma.
