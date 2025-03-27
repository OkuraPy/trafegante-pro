# Dashboard Trafegante Pro

Dashboard administrativo moderno com visualização de métricas, gráficos e análises em tempo real.

## Tecnologias

- React 18 com TypeScript
- Vite para build e desenvolvimento
- Tailwind CSS para estilização
- Recharts para gráficos interativos
- Lucide React para ícones

## Deploy na Vercel

Este projeto está configurado para ser implantado na Vercel.

### Deploy Automático (recomendado)

1. Faça fork ou clone este repositório para sua conta do GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. A Vercel detectará automaticamente as configurações do Vite
5. Clique em "Deploy"

### Deploy Manual

Você também pode fazer deploy manualmente usando a Vercel CLI:

```bash
# Instale a Vercel CLI globalmente
npm install -g vercel

# Faça login na sua conta
vercel login

# No diretório do projeto, execute:
vercel
```

## Desenvolvimento Local

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Faça o build para produção
npm run build

# Visualize a build localmente
npm run preview
```

## Estrutura do Projeto

- `/src` - Código fonte da aplicação
- `/public` - Arquivos estáticos
- `/dist` - Diretório de build (gerado automaticamente)

## Personalização

Para personalizar este dashboard:

1. Modifique os dados em `src/App.tsx` para refletir seus próprios valores
2. Ajuste o esquema de cores no Tailwind CSS
3. Adicione ou remova componentes conforme necessário 