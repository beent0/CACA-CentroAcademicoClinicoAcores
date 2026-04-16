PEI 1
 João Bento 2023110753
 Manuel Santos 2023110848
 Yuri Moreira 2023118908


Cores:

Azul marinho #0B2545, utilizado como cor principal. Transmite seriedade, cria um bom contraste com o restante das cores escolhidas e enquadra-se no tema de saúde do site

Verde água #29B89E, utilizado nos títulos de cada secção apenas pelo seu contraste e para evitar um site monocromático em todos os detalhes, é também uma cor recorrente no ambiente clínico.

Azul claro #3371F2, utilizado para alguns botões interativos por ser uma cor que contrasta bem com o azul marinho, evitando que a cor principal se torne repetitiva
 ou imperceptível em algumas zonas do site

Azul gelo #EEF4ED, utilizado para background dos cards para ter um efeito mais discreto, manter os contrastes em diferentes tons de azul e evitar o branco sobre branco  

Branco #ffffff, utlizado como background de todo o site, semelhante a um ambiente clínico/hospitalar destaca-se pela sua sobriedade e dá espaço para qualquer cor se destacar.
O contraste com as cores escolhidas deixa o site facilmente legível e com um aspeto organizado.

Fonte: Montserrat
Esta fonte foi escolhida pela sua boa legibilidade e minimalismo, juntamente com a escollha de cores é uma combinação que atende a grande parte do público, pois o azul é dificilmente alterado
na maioria dos tipos de daltonismo e a simplicidade e geometria da fonte facilita a leitura para pessoa com deficiências visuais.

Benchmarking:

CCAL (Centro clínico académico de Lisboa) - secção hero, secção notícias e eventos (utilização dos cards em linhas de 3) e organização da informação.

Este site contribuiu para o nosso trabalho principalmente pela utilização dos cards em linha para apresentar a informação, é um visual limpo e organizado por isso decidimos adotá-lo.
No entanto, para manter a simplicidade, ao contrário do CCAL decidimos apenas deixar visível o título de cada notícia com a opção de um botão "saber mais" para quem busca mais informação,
contudo, por mais que seja uma boa estratégia para reduzir o texto na página inicial limita também os detalhes dados porque nesta fase do trabalho trabalhamos só com a landing page.

CCAB (Centro clínico académico das beiras) - baseamo-nos apenas na estrutura da barra de navegação do site.

CAC-CL (Centro clínico académico católica luz) - baseamo-nos principalmente na secção de eventos pela sua criatividade e no footer com a adição de uma newsletter, a forma como a informação foi distribuída
ao longo de todo o site também foi utilizada por nós, pois transmite a informação de uma forma clara e objetiva e de modo a chamar a atenção do utilizador.

#----------------------------------------------------------------------------------------------------------------------------------------#

PEI 2
João Bento 2023110753
Rafael Medeiros 2024109280
Yuri Moreira 2023118908

Acessibilidade Visual:
    Cores:
        Background: 
            --white #ffffff
                Cor utilizada para o background da página, promove um excelente contraste, passando em todos os testes WCAG AAA com práticamente todas as outras cores utilizadas.
            
            --bg-light: #EEF4ED
                Esta cor é utilizada para backgrounds de cards e outras situações similares, sendo emparelhada com preto #000000 ou a cor primária #0B2545. Passa em todos os testes WCAG AAA.

        Comparações:
            --primary color: #0B2545
                Apresenta um contraste de 15.38:1, passando os testes WCAG AAA para texto normal, trexto grande e elementos gráficos.

            --accent-color: #29B89E
                Apresenta um contraste de 2.48:1, não passando os testes. Esta cor será alterada para #1B8572. 
            Nova --accent-color: #1B8572
                Apresenta um contraste de 4.52:1, falhando apenas o teste WCAG AAA para texto normal, como é utilizado apenas em textos maiores isto não terá muito impacto.

            --accent-color1: #3371F2
                Apresenta um contraste de 4.38:1, não passando os testes WCAG AAA necessários à sua utilidade. Esta cor será alterada para #2C6BF2.
            Nova --accent-color1: #2C6BF2
                Apresenta um contraste de 4.67:1, falhando apenas o teste WCAG AAA para texto normal, passando nos restantes necesseários à sua utilidade.

            --text-color: #000000
                Cor utilizada para texto, cumpre com todos os testes WCAG AAA com os backgrounds utilizados.

        A utilização destas cores permitem acessibilidade a pessoas com deficiências visuais, como por exemplo, Visão Desfocada, Contraste Reduzido e Daltonismo.

    Fonte:
        Montserrat
            Esta fonte foi escolhida pela sua boa legibilidade e minimalismo, possui um espaçamento uniforme entre cada letra e foi criada utilizando formas geométricas perfeitas, isto promove acessibilidade para pessoas com deficiências visuais, por exemplo, Dislexia.
    

    Dark Mode
        Utilizado um background escuro com letras claras para melhor acessibilidade (contraste) e/ou preferência do usuário. 
            
Acessibilidade Motora:
    Espaço entre clicáveis para utilizadores com dificuldades motoras
    Resizing correto para os diferentes dispositivos.

Outras Acessibilidades (Preferencias):
    media queries (reduced motion)
        Verifica se o utilizador tem reduced motion ativado e "desativa" as transições
#----------------------------------------------------------------------------------------------------------------------------------------#
PEI 3

João Bento 2023110753
Tomás Couto 2024111781
Newton Pereira 2022122784


Updates- Newton  PEI3
 Internacionalização (i18n) – Suporte a 5 idiomas

Foi implementado um sistema completo de internacionalização no site do **Centro Académico Clínico dos Açores**. Agora o conteúdo pode ser visualizado em **Português, Inglês, Espanhol, Francês e Alemão**, com mudança dinâmica de idioma sem recarregar a página.

 Principais alterações

 Estrutura de tradução (JSON)
- Criada a pasta `/lang` com 5 ficheiros:
  - `pt.json` (português)
  - `en.json` (inglês)
  - `es.json` (espanhol)
  - `fr.json` (francês)
  - `de.json` (alemão)
- Cada ficheiro contém um objeto chave → valor com todos os textos do site (títulos, parágrafos, botões, placeholders, mensagens de validação, etc.).

 HTML adaptado com atributos `data-i18n`
- Todos os elementos com texto estático receberam o atributo `data-i18n="chave"`.
- Placeholders de formulário usam `data-i18n-attr="placeholder:chave"`.
- O título da página (`<title>`) também é traduzível.

 Seletor de idiomas com bandeiras
- Adicionado um seletor visual junto ao menu de navegação.
- Utilizado o CDN **flag-icons** para bandeiras em SVG de alta qualidade.
- Botões de bandeira (`PT`, `EN`, `ES`, `FR`, `DE`) com efeito hover e responsivo.

 JavaScript – Sistema de tradução dinâmica
- Funções principais:
  - `loadLanguage(lang)`: carrega o JSON correspondente e aplica as traduções.
  - `applyTranslations()`: percorre o DOM e substitui textos/atributos.
  - `getInitialLanguage()`: deteta idioma do navegador ou usa `localStorage`.
  - `initLanguageSelector()`: associa eventos de clique às bandeiras.
- As preferências de idioma são guardadas no `localStorage`.
- Evento personalizado `languageChanged` permite que outros módulos (ex: gráficos) reajam à mudança de idioma.

 Adaptação de componentes específicos
- **Formulário de newsletter**: mensagens de erro/sucesso traduzidas dinamicamente.
- **Dropdown de assunto**: as mensagens pré‑definidas (ajuda, evento, marcação, ensino) são buscadas a partir das traduções.
- **Gráficos (D3.js)**: os títulos dos gráficos recarregam automaticamente com o idioma selecionado, mantendo os dados estáticos.

 Ajustes de layout e CSS
- Estilos para o seletor de idiomas (`.lang-switcher` e `.lang-btn`).
- Reposicionamento do botão de modo escuro (agora **depois** das bandeiras).
- Tratamento responsivo para títulos longos (ex: alemão) que poderiam quebrar o header – uso de `clamp()` e `white-space: nowrap` com overflow controlado.
- Em ecrãs pequenos, o título textual do header é ocultado para evitar sobreposição.

. Validação e consistência
- As mensagens de validação (`form_error`, `form_success`) estão traduzidas em todos os idiomas.
- As mensagens pré‑definidas do dropdown foram adaptadas para formas mais neutras (ex: "Boas" → "Olá") para facilitar traduções perfeitas.

 Como testar

1. Abrir o site num servidor local (Live Server ou similar).
2. Clicar nas bandeiras no canto superior direito.
3. Verificar que todo o conteúdo (incluindo gráficos, formulário e mensagens de feedback) muda para o idioma selecionado.
4. Recarregar a página – o idioma escolhido mantém‑se graças ao `localStorage`.

 Ficheiros alterados / adicionados

- `index.html` – atributos `data-i18n` e seletor de bandeiras.
- `style.css` – estilos para o seletor e responsividade.
- `script.js` – sistema i18n completo e integração com formulário/dropdowns.
- `graficos.js` – recriação de gráficos ao mudar idioma.
- `lang/pt.json`, `lang/en.json`, `lang/es.json`, `lang/fr.json`, `lang/de.json` – ficheiros de tradução.

---

#### feature-eventos-crud (João Bento)
**Como Criar, Editar ou Remover Eventos**
- **Criar**: Ir ao footer -> Clicar em "Admin" -> Preencher o formulário com os dados do Evento -> Clicar em "Guardar Evento"
- **Editar**: Ir ao footer -> Clicar em "Admin" -> Clicar em "Editar" no Evento pretendido -> Realizar as mudanças -> Clicar em "Guardar Evento"
- **Remover**: Ir ao footer -> Clicar em "Admin" -> Clicar em "Eliminar" no Evento pretendido -> Confirmar em "OK"

**Gestão de Eventos (CRUD e IndexedDB)**
- **Adicionar/Editar**: Formulário único que altera entre criação e edição (baseado no ID do evento). Validação com mensagens de erro.
- **Visualizar**: Exibição dos eventos na IndexedDB no carrossel dos eventos na lista de gestão do admin.
- **Remover**: Remoção de eventos com confirmação ao utilizador.
- **Persistência**: Base de dados `EventosDB` com ObjectStore `eventos` (autoIncrement) e diferentes Index's (título, descrição, data, hora, local).

**Experiência do Utilizador e Acessibilidade**
- **Acessibilidade**: Imagens com `alt` descritivo baseado no título, `aria-label` no acesso admin e auto-focus ao abrir o painel de admin.
- **Dark Mode**: Integração com o Dark Mode do site.
- **Feedback**: Sistema de Toasts para confirmar operações.
- **Interface**: Secção do admin oculta por padrão, acessível através do link no footer do site.

**Estrutura de Dados (IndexedDB)**
- **Store**: `eventos`
- **Campos**: `id` (KeyPath), `titulo`, `descricao`, `data`, `hora`, `local`, `imagem`.
- **Índices**: Criados para todos os campos principais.

---

Updates Tomás Couto PEI3

Novas funcionalidades implementadas:

 Google Maps:
  Foi adicionado um mapa interativo que aponta para a Universidade dos Açores. O carregamento é feito de forma assíncrona para garantir a performance do site.
  
  - Como configurar:
    1. Conseguir a sua API Key: Ir à Google Cloud Console (https://console.cloud.google.com/) e ativar a *Maps JavaScript API*
    2. Criar o ficheiro de configuração:
       -Na pasta "API", que está dentro da pasta "JavaScript", existe um ficheiro com o nome de "config.example.js".
       -Fazer uma cópia desse mesmo ficheiro e mudar o nome para apenas "config.js".
    3. Colocar a API Key no ficheiro
       - Abrir o novo ficheiro "config.js" e substituir o texto "API_KEY_HERE" pela API Key gerada:
         const CONFIG = {
             GOOGLE_MAPS_API_KEY: "API_KEY_HERE"
         };
   Em caso de dúvida para conseguir a sua chave API, ver o vídeo *How to generate and restrict API key for Google Maps Platform* (https://www.youtube.com/watch?v=2_HZObVbe-g)

   Para além disso foi implementado a Places API, ao criar um evento e selecionar o local, ele automaticamente tenta associar a locais reais, ao selecionar o local ele atualiza na base de dados
   com os valores de "latitude" e "longitude"

 Noticias:
 Foi adicionado 3 cartões de notícias interativas. O carregamento é feito de forma assíncrona de forma a garantir a performance do site.

 - Como configurar:
   1. Conseguir a sua API Key: Ir à Gnews (https://gnews.io) e conseguir uma API Key.
   2. Na mesma pasta "API", no ficheiro com o novo nome "config.js", substituir o texto "API_KEY_HERE" pela API Key gerada:
   const CONFIG = {
        GNEWS_API_KEY: "API_KEY_HERE"
}

 Meteorologia:
 Atributo adicionado na base de dados: clima
  este atributo contém as 3 informações:
   - "temp" > Temperatura
   - "desc" > descrição (ex: "Nublado")
   - "icon" > Icon da descrição
     
 Foi implementado através da OpenWeatherMap API a previsão do tempo para a criação de um evento:
  Selecionando a data, hora e local automaticamente aparece uma mensagem de previsão do tempo
 
 Caso o evento tenha o atributo clima, irá aparecer nos cartões de eventos a respetiva previsão

 - Como configurar:
   1. Conseguir a sua API Key: Ir à OpenWeatherMaps (https://openweathermap.org) e conseguir uma API Key.
   2. Na mesma pasta "API", no ficheiro com o novo nome "config.js", substituir o texto "API_KEY_HERE" pela API Key gerada:
   const CONFIG = {
        WEATHER_API_KEY: "API_KEY_HERE"
}
