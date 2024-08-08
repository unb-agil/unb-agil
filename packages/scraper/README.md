# Scraper

## Visão Geral

O **scraper** é projetado para coletar dados do SIGAA (com o Puppeteer) e armazená-los no banco de dados.

## Diretórios

- **config**: Contém as configurações;
- **controllers**: Orquestra a execução de diferentes scrapers;
- **scrapers**: Contém a lógica para obter os dados do site;
- **models**: Define a estrutura de dados das entidades.

## Premissas

O **primeiro dado** relacionado a uma entidade a ser obtido deve ser seu **ID**. O ID é necessário para encontrar qualquer outro dado complementar, como nome, acrônimo etc.

As estratégias estão listadas em ordem de **granularidade** de modo que as marcações `MVP` também devem **implementar os itens seguintes**. Isso irá ajudar em consultas por entidades avulsas.

## Possíveis cenários e MVP

Há inúmeros cenários e estratégias para extrair os dados do SIGAA. Para que a implementação não perca o foco da etapa atual, apenas as estratégias relevantes para o MVP serão feitas no momento.

O MVP consiste nos dados de Engenharia de Software, com possibilidade para as outras engenharias da FGA. Portanto, não será necessário extrair dados de outros departamentos.

### Departamentos

#### 1. Estratégias para obter IDs

- Obter IDs de todos os departamentos.

#### 2. Estratégias para obter dados

- Obter dados de todos os departamentos com ID armazenado;
- `MVP` Obter dados de departamentos específicos com ID armazenado.

> O ID da FGA, departamento responsável pelo curso de Engenharia de Software, é `673`.

### Curso (Program)

#### 1. Estratégias para obter IDs

- Obter IDs de todos os cursos de todos os departamentos armazenados;
- Obter IDs de todos os cursos de departamentos específicos armazenados.

#### 2. Estratégias para obter dados

- Obter dados de todos os cursos com IDs armazenados;
- Obter dados de todos os cursos de um departamento com ID armazenado;
- `MVP` Obter dados de cursos específicos com ID armazenado.

> O ID do curso de Engenharia de Software é `414924`

### Currículo

#### 1. Estratégias para obter IDs

- Obter IDs de todos os currículos de todos cursos de todos os departamentos armazenados;
- Obter dados de todos os currículos de todos os cursos de departamentos específicos armazenados;
- `MVP` Obter dados de todos os currículos de cursos específico armazenados;
- Obter dados de currículos específicos armazenados.

#### 2. Estratégias para obter dados

- Obter dados de todos os currículos armazenados;
- Obter dados de todos os currículos de todos os cursos de todos os departamentos;
- Obter dados de todos os currículos de todos os cursos de departamentos específicos;
- `MVP` Obter dados de todos os currículos de cursos específicos;
- Obter dados de currículos específicos.

> Engenharia de Software, e outros cursos da FGA, possuem poucos currículos e todos serão extraídos.

### Componentes curriculares

#### 1. Estratégias para obter IDs

- Obter os IDs de todos os componentes curriculares;
- Obter os IDS de todos os componentes de departamentos específicos;
- `MVP` Obter os IDs de todos os componentes\* de um curso específico;
- Obter os IDs de todos os componentes de um currículo específico.

> \*Componentes obrigatórios, optativos e presentes em cadeias de seletividade ("optatórios").

#### 2. Estratégias para obter dados

- Obter dados de todos os componentes armazenados;
- Obter dados de todos os componentes de departamentos específicos;
- `MVP` Obter os dados de todos os componentes de um curso específico;
- Obter os dados de todos os componentes de um currículo específico;
- Obter os dados de componentes específicos.
