#VERSION original ---

# FROM node:20-slim AS base
# WORKDIR /app

# COPY package.json package-lock.json* ./
# RUN npm install && npm cache clean --force
# COPY . ./
# RUN npm run build

# FROM base
# COPY --from=base /app/.output/server/index.mjs /app/.output/server/index.mjs
# EXPOSE 8000
# CMD [ "node", ".output/server/index.mjs" ]

#VERISON 1 ---

# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app
# WORKDIR /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 8000
# CMD [ "pnpm", "start" ]

#VERSION 2 ---
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