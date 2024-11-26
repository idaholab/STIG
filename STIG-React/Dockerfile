FROM node:22
RUN mkdir STIG/
WORKDIR /STIG
COPY app ./
COPY public ./
COPY src ./
COPY index.html ./
COPY package.json ./
COPY package-lock.json ./
COPY postcss.config.js ./
COPY tailwind.config.cjs ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
RUN npm install --quiet
CMD ["npm", "run", "dev"]