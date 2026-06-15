import type { Book } from "./books";

const mk = (
  id: string,
  title: string,
  author: string,
  category: Book["category"],
  cover: string,
  accent: string,
  synopsis: string,
  tags: NonNullable<Book["tags"]>,
  rating = 4.7,
): Book => ({ id, title, author, category, cover, accent, synopsis, rating, tags });

const G = {
  rose: "from-pink-400 via-rose-500 to-pink-700",
  dark: "from-rose-950 via-black to-pink-950",
  mafia: "from-zinc-900 via-red-950 to-black",
  gold: "from-amber-700 via-yellow-600 to-rose-700",
  fantasy: "from-purple-700 via-pink-700 to-rose-900",
};

export const mostWantedCurated: Book[] = [
  mk("cur-mw-1", "As Coisas que Nunca Superamos", "Lucy Score", "romance", G.rose, "rose", "Naomi foge do casamento e acaba presa em uma cidade pequena com um xerife rabugento que não quer companhia — muito menos a dela.", ["top"], 4.8),
  mk("cur-mw-2", "É Assim que Acaba", "Colleen Hoover", "romance", G.rose, "rose", "Lily reencontra Atlas e precisa enfrentar o que jurou nunca repetir.", ["top"], 4.9),
  mk("cur-mw-3", "Amor Cruel", "Colleen Hoover", "dark-romance", G.dark, "rose", "Tate e Miles fecham um pacto: sem perguntas, sem promessas.", ["top"], 4.7),
  mk("cur-mw-4", "A Canção de Aquiles", "Madeline Miller", "romance", G.gold, "amber", "A história de amor entre Aquiles e Pátroclo recontada com lirismo devastador.", ["top"], 4.9),
  mk("cur-mw-5", "Vermelho, Branco e Sangue Azul", "Casey McQuiston", "romance", G.rose, "rose", "O filho da presidente americana e o príncipe da Inglaterra: do escândalo ao romance.", ["top"], 4.8),
  mk("cur-mw-6", "O Príncipe Cruel", "Holly Black", "fantasia-romantica", G.fantasy, "purple", "Jude, humana criada entre fadas, decide enfrentar o cruel príncipe Cardan.", ["top"], 4.7),
  mk("cur-mw-7", "Quarta Asa", "Rebecca Yarros", "fantasia-romantica", G.fantasy, "purple", "Violet entra para a elite dos cavaleiros de dragões — sobreviver é só o começo.", ["top"], 4.9),
  mk("cur-mw-8", "Praise", "Sara Cate", "dark-romance", G.dark, "rose", "Margaret descobre desejos que jurou nunca admitir nas mãos de um homem mais velho.", ["top"], 4.6),
  mk("cur-mw-9", "Leitura de Verão", "Emily Henry", "romance", G.rose, "rose", "Dois escritores rivais trocam de gênero por um verão — e se reencontram.", ["top"], 4.7),
  mk("cur-mw-10", "A Seleção", "Kiera Cass", "romance", G.rose, "rose", "America é escolhida para disputar o coração do príncipe Maxon entre 35 candidatas.", ["top"], 4.6),
];

export const mostReadCurated: Book[] = [
  mk("cur-mr-1", "O Duque e Eu", "Julia Quinn", "romance", G.gold, "amber", "Daphne Bridgerton e o duque Simon fingem um romance que se torna real.", ["top"], 4.7),
  mk("cur-mr-2", "O Acordo", "Elle Kennedy", "romance", G.rose, "rose", "Hannah fecha um acordo com o astro do hóquei Garrett — aulas em troca de ciúmes.", ["top"], 4.7),
  mk("cur-mr-3", "Diário de uma Paixão", "Nicholas Sparks", "romance", G.gold, "amber", "Noah e Allie, um verão de amor que atravessa décadas.", ["top"], 4.8),
  mk("cur-mr-4", "Verity", "Colleen Hoover", "dark-romance", G.dark, "rose", "Lowen aceita terminar a saga de Verity Crawford — e descobre um manuscrito perturbador.", ["top"], 4.8),
  mk("cur-mr-5", "O Coração do Bilionário", "J.S. Scott", "bilionarios", G.gold, "amber", "Sam Hudson, o solitário bilionário, encontra em Maddie a chance de sentir de novo.", ["top"], 4.5),
  mk("cur-mr-6", "Todas as Suas Imperfeições", "Colleen Hoover", "romance", G.rose, "rose", "Quinn e Graham tentam reconstruir o que parecia um casamento perfeito.", ["top"], 4.7),
  mk("cur-mr-7", "O Lado Feio do Amor", "Colleen Hoover", "romance", G.rose, "rose", "Tate quer começar do zero; Miles quer esquecer. O coração tem outros planos.", ["top"], 4.6),
  mk("cur-mr-8", "Sinto a Tua Falta", "Harlan Coben", "romance", G.dark, "rose", "Uma detetive reencontra o ex-noivo desaparecido — e abre uma trama de segredos.", ["top"], 4.5),
  mk("cur-mr-9", "Cretino Irresistível", "Christina Lauren", "romance", G.rose, "rose", "Bennett e Chloe se odeiam no escritório e se desejam fora dele.", ["top"], 4.6),
  mk("cur-mr-10", "Segredos de Uma Noite de Verão", "Lisa Kleypas", "romance", G.gold, "amber", "Annabelle e três amigas se unem para conquistar bons casamentos na temporada londrina.", ["top"], 4.7),
];

export const newestCurated: Book[] = [
  mk("cur-nw-1", "Coração Destemido", "Maggie Gates", "romance", G.rose, "rose", "Lançamento 2026: uma história de amor onde coragem e vulnerabilidade caminham juntas.", ["new"], 4.6),
  mk("cur-nw-2", "Maridos e Amantes", "Beatriz Williams", "romance", G.gold, "amber", "Lançamento 2026: segredos de família e paixões proibidas em um drama de época.", ["new"], 4.6),
  mk("cur-nw-3", "As Sombras da Noite", "Autumn Woods", "dark-romance", G.dark, "rose", "Lançamento 2026: um romance sombrio onde o desejo se confunde com perigo.", ["new"], 4.5),
  mk("cur-nw-4", "Na Escuridão", "Navessa Allen", "dark-romance", G.dark, "rose", "Uma stalker romance perturbadora e viciante que dominou as redes em 2025.", ["new"], 4.7),
  mk("cur-nw-5", "Só Mais um Poema Épico de Amor", "Parisa Akhbari", "romance", G.rose, "rose", "Duas melhores amigas, uma poesia compartilhada — e sentimentos que mudam tudo.", ["new"], 4.5),
  mk("cur-nw-6", "Desejada pelo Viking", "Felicity Brandon & Anna Quinn", "romance", G.gold, "amber", "Capturada por um guerreiro do norte, ela descobre que o desejo pode ser mais forte que o cativeiro.", ["new"], 4.4),
  mk("cur-nw-7", "Sorte no Amor", "Lynn Painter", "romance", G.rose, "rose", "Em Vegas, um casamento por engano vira a melhor coisa que poderia ter acontecido.", ["new"], 4.7),
  mk("cur-nw-8", "Profundezas", "Rebecca Yarros", "fantasia-romantica", G.fantasy, "purple", "A continuação aguardada da saga dos cavaleiros de dragões.", ["new"], 4.8),
  mk("cur-nw-9", "Dono da Minha Alma", "Scarlett Noir", "dark-romance", G.dark, "rose", "Um pacto sombrio liga seu destino ao homem que jurou destruí-la.", ["new"], 4.5),
  mk("cur-nw-10", "Desvios do Destino", "Vi Keeland", "romance", G.rose, "rose", "Um encontro de uma noite vira o reencontro mais inesperado anos depois.", ["new"], 4.6),
];

export const trendingCurated: Book[] = [
  mk("cur-tr-1", "Tryst Six Venom", "Penelope Douglas", "dark-romance", G.dark, "rose", "Rivais no campo, inimigas mortais fora dele — até que o ódio vira outra coisa.", ["trending"], 4.7),
  mk("cur-tr-2", "Corrupt", "Penelope Douglas", "dark-romance", G.dark, "rose", "Erika sempre desejou Michael. Agora ele está livre — e quer cobrar cada segredo.", ["trending"], 4.8),
  mk("cur-tr-3", "Wicked — Era Uma Vez um Vilão", "Bianca Cole", "mafia-romance", G.mafia, "red", "O herdeiro da máfia decide que ela é sua — não importa o preço.", ["trending"], 4.6),
  mk("cur-tr-4", "Na Escuridão", "Navessa Allen", "dark-romance", G.dark, "rose", "Stalker romance: ela sabe que ele a observa. E gosta disso.", ["trending"], 4.7),
  mk("cur-tr-5", "Sangre Por Nós", "Molly Doyle", "dark-romance", G.mafia, "red", "Uma vingança que se desenrola entre sangue, lealdade e desejo.", ["trending"], 4.5),
  mk("cur-tr-6", "O Caos em Monsterland", "Lexi C. Foss", "dark-romance", G.dark, "purple", "Monstros, magia e um romance reverse harem que viciou leitoras.", ["trending"], 4.6),
  mk("cur-tr-7", "Marcando Mia", "Layla Sparks", "dark-romance", G.dark, "rose", "Possessivo, obsessivo, perigoso — ele a marcou antes mesmo de tocá-la.", ["trending"], 4.5),
  mk("cur-tr-8", "Fear Me, Love Me", "Lilith Vincent", "dark-romance", G.dark, "rose", "Um romance sombrio onde medo e amor se confundem em cada página.", ["trending"], 4.6),
  mk("cur-tr-9", "Um Jogo de Deuses", "Scarlett St. Clair", "fantasia-romantica", G.fantasy, "purple", "Perséfone e Hades em uma releitura sensual do mito grego.", ["trending"], 4.7),
  mk("cur-tr-10", "Viciado em Você", "Krista & Becca Ritchie", "romance", G.rose, "rose", "Lily é viciada em sexo, Lo em álcool — juntos fingem um namoro para esconder tudo.", ["trending"], 4.7),
];

export const favoritesCurated: Book[] = [
  mk("cur-fv-1", "As Coisas que Guardamos em Segredo", "Lucy Score", "romance", G.rose, "rose", "Knox e Naomi voltam a se encontrar — e os segredos guardados explodem.", ["favorites"], 4.8),
  mk("cur-fv-2", "Uma Segunda Chance", "Colleen Hoover", "romance", G.rose, "rose", "Sydney e Ridge precisam decidir se o amor sobrevive à distância e ao tempo.", ["favorites"], 4.6),
  mk("cur-fv-3", "Teto Para Dois", "Beth O'Leary", "romance", G.rose, "rose", "Tiffy e Leon dividem o mesmo apartamento — em turnos opostos. Até se conhecerem.", ["favorites"], 4.7),
  mk("cur-fv-4", "Amor(es) Verdadeiro(s)", "Taylor Jenkins Reid", "romance", G.gold, "amber", "Emma reencontra o primeiro amor e questiona a vida que construiu.", ["favorites"], 4.6),
  mk("cur-fv-5", "Daisy Jones & The Six", "Taylor Jenkins Reid", "romance", G.gold, "amber", "A ascensão e queda de uma banda dos anos 70 — e o amor que a destruiu.", ["favorites"], 4.8),
  mk("cur-fv-6", "Um Amor Conveniente", "Tessa Dare", "romance", G.gold, "amber", "Um casamento de fachada na Regência britânica que se torna o oposto.", ["favorites"], 4.5),
  mk("cur-fv-7", "Café, Amor e Highlanders", "Meghan Quinn", "romance", G.rose, "rose", "Uma viagem à Escócia, três amigas e três highlanders inesquecíveis.", ["favorites"], 4.6),
  mk("cur-fv-8", "Querido Vizinho", "Penelope Ward", "romance", G.rose, "rose", "Chelsea descobre que seu novo vizinho é o melhor amigo do irmão que ela sempre amou.", ["favorites"], 4.6),
  mk("cur-fv-9", "A Troca", "Beth O'Leary", "romance", G.rose, "rose", "Avó e neta trocam de casa por dois meses — e mudam suas vidas para sempre.", ["favorites"], 4.7),
  mk("cur-fv-10", "Sorte no Amor", "Lynn Painter", "romance", G.rose, "rose", "Em Vegas, o que acontece... nem sempre fica em Vegas.", ["favorites"], 4.7),
];