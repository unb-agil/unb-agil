# Instalação

## NVM

Para facilitar a gestão de versões do Node.js em diferentes projetos, é sugerida a utilização do [Node Version Manager](https://github.com/nvm-sh/nvm).

Depois de instalar o NVM, navegue até o diretório do projeto e execute o comando abaixo para usar a versão correta do Node.js especificada no arquivo .nvmrc:

```bash
nvm use
```

Se a versão do Node.js especificada no arquivo .nvmrc não estiver instalada, você pode instalá-la com o seguinte comando:

```bash
nvm install
```

# Yarn
O Yarn é utilizado como gerenciador de pacotes neste projeto. Para instalá-lo, siga as instruções abaixo:

Instale o Yarn globalmente:

```bash
npm install -g yarn
```

Instale as dependências do projeto:

```bash
yarn install
```

# Configuração do VSCode

Recomenda-se utilizar a extensão Prettier para formatação de código. As configurações recomendadas para extensões estão no arquivo .vscode/extensions.json.
