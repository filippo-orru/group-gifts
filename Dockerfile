FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

RUN mkdir -p /app
COPY pnpm-lock.yaml /app
WORKDIR /app
RUN pnpm fetch --prod

COPY . /app
RUN pnpm install --offline --frozen-lockfile --prod
RUN pnpm run build

FROM base
COPY --from=prod /app/.output /app/.output
EXPOSE 8000
CMD [ "node", "/app/.output/server/index.mjs" ]