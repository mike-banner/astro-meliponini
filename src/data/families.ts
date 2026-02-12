
export interface Family {
    id: string;
    name: string;
    link: string;
    content: string;
    image?: string;
    category: "meliponini" | "apini";
}

export const families: Family[] = [
    {
        id: "apis",
        name: "Apis",
        link: "/categorie/apini/apis",
        category: "apini",
        image: "/images/familles/apis.jpg", // Placeholder
        content: `<h5>Le genre <strong>Apis mellifera</strong></h5>
    <p>Comporte vingt-huit sous-espèces (toutes fécondables entre elles) réparties en cinq groupes majeurs (selon leurs évolutions et leurs répartitions géographiques) basés sur le travail de Friedrich Ruttner et confirmés par l’analyse de l’ADN mitochondrial :</p>
    <br>
    <h6>Les variétés les plus utilisées en apiculture sont :</h6>
    <ul>
      <li>La Buckfast, un hybride de multiples variétés sélectionnées</li>
      <li>Apis mellifera ligustica, l’abeille jaune italienne</li>
      <li>Apis mellifera carnica, l’abeille carniolienne</li>
      <li>Apis mellifera mellifera, l’abeille noire</li>
      <li>Apis mellifera caucasica, l’abeille du Caucase</li>
    </ul>
    <br>
    <h6>Lignée ou type A (groupe Africain)</h6>
    <ul>
      <li>Apis mellifera adansonii (Latreille)</li>
      <li>Apis mellifera capensis (Eschscholtz)</li>
      <li>Apis mellifera intermissa (Maa)</li>
      <li>Apis mellifera litorea (Smith)</li>
      <li>Apis mellifera monticola (Smith)</li>
      <li>Apis mellifera sahariensis (Baldensperger)</li>
      <li>Apis mellifera scutellata (Lepeletier)</li>
      <li>Apis mellifera sicula (Montagano)</li>
      <li>Apis mellifera unicolor (Latreille)</li>
    </ul>
    <h6>Lignée ou type C (groupe Carniole, de l’Europe de l’Est et du sud des Alpes)</h6>
    <ul>
      <li>Apis mellifera carnica (Pollman)</li>
      <li>Apis mellifera cecropia (Kiesenwetter)</li>
      <li>Apis mellifera ligustica (Spinola)</li>
      <li>Apis mellifera macedonica (Ruttner)</li>
    </ul>
    <h6>Lignée ou type M (groupe Méditerranéen, de l’Ouest et du Nord)</h6>
    <ul>
      <li>Apis mellifera iberica (Engel)</li>
      <li>Apis mellifera mellifera (Linnaeus)</li>
      <li>Apis mellifera siciliana (Grassi)</li>
    </ul>
    <h6>Lignée ou type O (groupe du Moyen-Orient et de l’Asie centrale)</h6>
    <ul>
      <li>Apis mellifera adami (Ruttner)</li>
      <li>Apis mellifera anatoliaca (Maa)</li>
      <li>Apis mellifera armeniaca (es)</li>
      <li>Apis mellifera caucasia (Pollmann)</li>
      <li>Apis mellifera cypria (Pollman)</li>
      <li>Apis mellifera lamarckii (Cockerell)</li>
      <li>Apis mellifera meda (Skorikov)</li>
      <li>Apis mellifera syriaca (Skorikov)</li>
      <li>Apis mellifera taurica (Alpatov)</li>
    </ul>
    <h6>Lignée ou type Y (groupe Nord-Est, de l’Éthiopie et du Yemen )</h6>
    <ul>
      <li>Apis mellifera jemenitica (Ruttner)</li>
    </ul>
    <br>
    <h6>Reste à classer :</h6>
    <ul>
      <li>Apis mellifera artemisia (Engel)</li>
      <li>Apis mellifera remipes (Gerstaecker)</li>
      <li>Apis mellifera ruttneri (Sheppard, Arias, Grech & Meixner)</li>
      <li>Apis mellifera sossimai (Engel)</li>
    </ul>`
    },
    {
        id: "melipona",
        name: "Melipona",
        link: "/categorie/meliponini/melipona",
        category: "meliponini",
        image: "/images/familles/melipona.jpg", // Placeholder
        content: `<p>Les <strong>Melipona</strong> sont un genre fascinant d’abeilles sans aiguillon appartenant à la famille des Apidae, tribu des Meliponini. Elles jouent un rôle crucial dans les écosystèmes tropicaux et dans les pratiques apicoles traditionnelles. Elles sont d’excellentes pollinisatrices de la flore tropicale, car elles ont une nette préférence pour les fleurs indigènes.</p>
    <p><strong>Distribution :</strong> Principalement présentes en Amérique Latine tropicale (du Mexique à l’Amazonie).<br />Le genre Melipona regroupe plus de 70 espèces, chacune avec des caractéristiques morphologiques, comportementales et écologiques spécifiques.<br />
    <strong>Taille :</strong> ce genre d'abeille regroupant un nombre important d'especes, leurs tailles peuvent varier d’environ 7mm jusqu’à 14 mm.<br />
    <strong>Miel :</strong> Leur miel est très fluide, plus acide, et moins sucré que celui des abeilles européennes (Apis mellifera).<br />Il possède des propriétés médicinales remarquables (antibactériennes, cicatrisantes, anti-inflammatoires).<br />Très recherché dans la médecine traditionnelle, notamment chez les peuples indigènes d’Amérique centrale et du Sud.<br />
    <strong>Geopropolis :</strong> Le géopropolis est une substance résineuse produite par les abeilles propres au genre Melipona. Cette substance est composée d’un mélange de résines végétales, de cire, de argiles et d’enzymes.<br />Elles utilisent le géopropolis pour sceller et protéger leurs nids contre les agents pathogènes et les prédateurs.<br />
    <strong>Cire :</strong> Les nids sont faits de cire mélangée à de la résine et de la propolis, formant une structure unique appelée batumen.</p>`
    },
    {
        id: "tetragonisca",
        name: "Tetragonisca",
        link: "/categorie/meliponini/tetragonisca",
        category: "meliponini",
        image: "/images/familles/tetragonisca.jpg", // Placeholder
        content: `<p>Genre : <strong>Tetragonisca</strong></p>
    <p>Les Tetragonisca sont des abeilles mélipones (sans dard) très populaires, notamment l’espèce Tetragonisca angustula, connue sous le nom de "Jataí". Elles sont très adaptables et produisent un miel de grande qualité.</p>
    <p><strong>Nidification :</strong> Elles construisent des nids discrets, souvent dans des cavités existantes (trous d'arbres, murs, bambous). L’entrée du nid est caractérisée par un tube de cire (cérumen) souvent perforé, gardé par des abeilles sentinelles qui volent en stationnaire.</p>
    <p><strong>Comportement :</strong> Très douces mais bien organisées pour la défense grâce à leurs sentinelles.</p>
    <p><strong>Miel :</strong> Leur miel est très apprécié, considéré comme médicinal (notamment pour les yeux dans la culture populaire brésilienne), fluide et très sucré.</p>`
    },
    {
        id: "scaptotrigona",
        name: "Scaptotrigona",
        link: "/categorie/meliponini/scaptotrigona",
        category: "meliponini",
        image: "/images/familles/scaptotrigona.jpg", // Placeholder
        content: `<p>Genre : <strong>Scaptotrigona</strong></p>
    <p>Ce genre regroupe des abeilles robustes, souvent noires ou sombres, connues pour être de bonnes productrices de miel mais aussi pour leur comportement défensif.</p>
    <p><strong>Nidification :</strong> Elles nichent souvent dans des troncs d’arbres creux de gros diamètre. L’entrée est en forme de trompette ou d’entonnoir large, faite de cérumen.</p>
    <p><strong>Comportement :</strong> Bien que sans dard, elles peuvent être agressives en s'emmêlant dans les cheveux ou en mordillant la peau avec leurs mandibules pour défendre la colonie. Elles dégagent parfois une odeur forte caractéristique.</p>
    <p><strong>Miel :</strong> Production abondante pour des mélipones, goût souvent intense et fermenté, très prisé.</p>`
    },
    {
        id: "plebeia",
        name: "Plebeia",
        link: "/categorie/meliponini/plebeia",
        category: "meliponini",
        image: "/images/familles/plebeia.jpg", // Placeholder
        content: `<p>Genre : <strong>Plebeia</strong></p>
    <p>Les abeilles du genre Plebeia sont généralement de très petite taille, souvent appelées "Mirim" au Brésil. Elles sont discrètes et essentielles à la pollinisation des petites fleurs.</p>
    <p><strong>Nidification :</strong> Elles s'installent dans de petites cavités, fissures de murs ou branches creuses. L'entrée est souvent un petit tube de cire sombre, parfois fermé la nuit.</p>
    <p><strong>Comportement :</strong> Très timides, elles se cachent en cas de menace. Inoffensives pour l'homme.</p>
    <p><strong>Miel :</strong> Produit en petite quantité, mais d'une grande finesse.</p>`
    },
    {
        id: "cephalotrigona",
        name: "Cephalotrigona",
        link: "/categorie/meliponini/cephalotrigona",
        category: "meliponini",
        image: "/images/familles/cephalotrigona.jpg", // Placeholder
        content: `<p>Genre : <strong>Cephalotrigona</strong></p>
    <p>Les Cephalotrigona, comme la "Mombucão", sont des abeilles plus grandes et robustes. On les trouve principalement en forêt.</p>
    <p><strong>Nidification :</strong> Elles nichent dans les grands arbres. L'entrée du nid est souvent peu visible ou située en hauteur.</p>
    <p><strong>Comportement :</strong> Elles ne sont pas agressives mais défendent leur nid efficacement. Elles sont connues pour récolter parfois des résines végétales collantes.</p>
    <p><strong>Miel :</strong> Miel dense et savoureux, produit en bonne quantité.</p>`
    }
];
