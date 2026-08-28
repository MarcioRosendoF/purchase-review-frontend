# Purchase Review Frontend

Interface web em React + TypeScript para a [Purchase Verified Review API](https://github.com/MarcioRosendoF/purchase-verified-review-api) — um marketplace onde só quem comprou um produto pode avaliá-lo.

Em desenvolvimento.

## Como rodar

Pré-requisito: o backend rodando em `http://localhost:8080`.

```bash
npm install
npm run dev
```

O proxy do Vite encaminha `/auth`, `/products`, `/orders` e `/reviews` para `localhost:8080`.
