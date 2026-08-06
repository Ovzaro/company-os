import { writeFile } from 'node:fs/promises';

import { checkAvailability } from './checker.js';

// Deliberately authored and ordered by brand judgment. This is a search set,
// not a combinatorial generator.
const candidates = [
  'Avenor', 'Ovara', 'Varelo', 'Cevora', 'Tavren', 'Oryva', 'Sovara', 'Elvora',
  'Avero', 'Noreva', 'Calven', 'Orvena', 'Virelo', 'Tavora', 'Merova', 'Avyren',
  'Soreva', 'Velari', 'Corven', 'Aurevo', 'Oryven', 'Valora', 'Evaren', 'Novera',
  'Cevran', 'Torven', 'Alvero', 'Rovena', 'Ovelar', 'Navero', 'Veylan', 'Arvena',
  'Calyra', 'Sorelo', 'Vireva', 'Oryvia', 'Talven', 'Avelor', 'Verano', 'Novelo',
  'Caelis', 'Aevora', 'Vaylen', 'Orlena', 'Ceryn', 'Tavelo', 'Solven', 'Nivora',
  'Elaris', 'Valenor', 'Orenza', 'Cavero', 'Aviora', 'Meralo', 'Sorven', 'Vireon',
  'Avenlo', 'Cevano', 'Orvela', 'Talora', 'Norelo', 'Rovaro', 'Evoran', 'Velora',
  'Sovren', 'Alvara', 'Oryla', 'Vareon', 'Calora', 'Aurela', 'Tivora', 'Elaro',
  'Novira', 'Avelis', 'Cavora', 'Oriven', 'Veyron', 'Salora', 'Elvaris', 'Tavira',
  'Norelis', 'Avaron', 'Solvara', 'Cerava', 'Ovelis', 'Varelis', 'Avenis', 'Elyven',
  'Coralis', 'Tavera', 'Nivaro', 'Oralis', 'Mavero', 'Aurelis', 'Virelis', 'Cevira',
  'Avenza', 'Velaris', 'Sovaro', 'Noveris', 'Orylis', 'Talenor', 'Evaris', 'Calyven',
  'Orvane', 'Avelan', 'Cerivo', 'Navora', 'Valeris', 'Evoren', 'Soralis', 'Tavaris',
  'Aevron', 'Cevris', 'Ovaren', 'Virel', 'Norev', 'Talver', 'Auralis', 'Vorenza',
  'Avelune', 'Oryntha', 'Valtira', 'Caldria', 'Elvarin', 'Norevia', 'Corvane', 'Velmora',
  'Arvello', 'Tervana', 'Averune', 'Cendria', 'Valmere', 'Norelia', 'Ovelune', 'Sorevia',
  'Arventa', 'Cevella', 'Elvoria', 'Tavrena', 'Merovia', 'Solvane', 'Norelta', 'Varesta',
  'Orenvia', 'Avelora', 'Coryven', 'Tavorel', 'Velaris', 'Navoren', 'Elarven', 'Sorelis',
  'Avenora', 'Calvera', 'Orvelis', 'Talerin', 'Virelia', 'Norevan', 'Aurevia', 'Cevorin',
  'Valeron', 'Oryndra', 'Elvaron', 'Corvela', 'Tavelyn', 'Meravin', 'Sovelia', 'Avenris',
  'Calyven', 'Orlavia', 'Varelin', 'Evorian', 'Norelis', 'Talvane', 'Cevrena', 'Velorin',
  'Auralen', 'Sorevan', 'Elveria', 'Navelyn', 'Oryvena', 'Calorin', 'Taverae', 'Merelon',
  'Avenlir', 'Corvian', 'Veleron', 'Norevia', 'Arvelis', 'Taviron', 'Cevoria', 'Solvren',
  'Elarune', 'Ovelora', 'Varelyn', 'Cendora', 'Talvera', 'Nivorel', 'Averian', 'Sorvena',
  'Calviro', 'Orvenis', 'Velmira', 'Avenell', 'Tavoren', 'Cevrion', 'Elorian', 'Navorel',
  'Varesta', 'Orynvia', 'Solmera', 'Avelrin', 'Corvena', 'Taloris', 'Meravel', 'Norevin',
  'Avenira', 'Velorian', 'Cevrana', 'Orvelyn', 'Taveroa', 'Elarvia', 'Sovrena', 'Calvena',
  'Averden', 'Calverin', 'Corvelis', 'Elvaren', 'Merovan', 'Naveren', 'Orvalen', 'Sorevin',
  'Tavelor', 'Aurevon', 'Cendrel', 'Norvale', 'Ovelian', 'Solvaren', 'Varelon', 'Caelora',
  'Asteron', 'Lumeris', 'Orphena', 'Aegeron', 'Cerynth', 'Elarion', 'Heliora', 'Solenne',
  'Aldorin', 'Caldren', 'Everane', 'Orynvale', 'Tervalis', 'Noverin', 'Avelore', 'Orliven',
  'Virelan', 'Tavoris', 'Aurenza', 'Cevorin', 'Elvaris', 'Norelan', 'Oryndel', 'Valthera',
  'Coralen', 'Taverin', 'Avenmar', 'Viresta', 'Caldora', 'Elvoren', 'Noresta', 'Oryvara',
  'Solvian', 'Taleron', 'Varelia', 'Avelorn', 'Cevarel', 'Elarune', 'Noverael', 'Orvalis',
  'Sorelan', 'Valeron', 'Aurenor', 'Calyren', 'Evarlen', 'Norevon', 'Orylane', 'Tavorel',
  'Velaren', 'Avenlor', 'Cevrane', 'Elvaran', 'Norvian', 'Orelven', 'Solvara', 'Taveron',
  'Virelta', 'Avelian', 'Corvella', 'Elarona', 'Meravel', 'Norelva', 'Oryvela', 'Tavrena',
  'Varelda', 'Avenrae', 'Cevoria', 'Elvarae', 'Noralen', 'Orynela', 'Solveta', 'Tavaris',
];

const results = new Array(candidates.length);
let cursor = 0;
async function worker() {
  while (cursor < candidates.length) {
    const index = cursor++;
    results[index] = { name: candidates[index], availability: await checkAvailability(candidates[index], { live: true }) };
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
await writeFile('final-name-checks.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(`Checked ${results.length} deliberately authored candidates.`);
