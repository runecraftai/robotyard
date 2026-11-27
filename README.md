# RobotYard

O estaleiro onde os agentes são construídos, cuidados e lançados.

Um produto sobre a base do Timon: app web de nível desktop, invólucro desktop, servidor como
monolito modular com dois pontos de entrada (gateway HTTP e daemon), e um sistema de plugins
que dá a cada bot um callsign e uma cabeça.

## Estrutura

```
apps/web        React + Vite + TanStack Router: cockpit (/) e página de callsign (/bots/$callsign)
apps/server     o servidor: src/gateway e src/daemon, dois pontos de entrada, um app
apps/docs       shell Vite da documentação, sem conteúdo até a migração
apps/desktop    stub documentado: empacotar falha de propósito até o invólucro ser decidido
packages/       contracts, ui (componentes e tokens), sdk e cli, os shells que provam o pipeline
tools/          verificações que provam fronteira, não que a documentam
```

## Dados

O daemon é dono do banco. `bun run db:migrate` em `apps/server` aplica a migração e cria
`.data/robotyard.db` (fora do controle de versão). O schema fica em `apps/server/src/daemon/db`,
e o gateway não pode importá-lo nem importar Drizzle.

## Fronteira entre gateway e daemon

`tsconfig.gateway.json` e `tsconfig.daemon.json` listam fontes disjuntas com `composite: true`.
Um import na direção errada não compila: falha com TS6307.
`bun run boundary` prova isso criando imports proibidos de propósito e exigindo a falha, nas duas
direções. Um import de pacote não cai na lista de arquivos, então o lint do gateway também proíbe
`drizzle-orm` e caminhos para `src/daemon`; o mesmo script prova que essa regra morde.

## Verificação

```sh
bun install
bun run typecheck && bun run lint && bun run test && bun run build
bun run boundary
```

A CI roda exatamente esses comandos, mais uma sonda de pseudo-terminal no Windows que decide
se o processo de terminal precisa continuar em Node naquela plataforma.
