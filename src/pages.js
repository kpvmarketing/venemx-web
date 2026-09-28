// Content for the category landing pages. Dishes, prices and photos come from
// the menu cards in src/index.html (build.js copies them), so only the copy
// around them lives here. Keep every claim tied to what the menu says.

const PHONE = '(386) 265-0055';

module.exports = {
  arepas: {
    paths: { en: '/arepas-daytona-beach/', es: '/es/arepas-daytona-beach/' },
    // which cards to show: [menu section id, optional name filter]
    cards: [['sec-arepas'], ['sec-des', /^Arepa/]],
    ogImage: '/assets/arepa-llanera.jpg',
    en: {
      title: 'Venezuelan Arepas in Daytona Beach | Venemex',
      description: 'Venezuelan arepas in Daytona Beach: Reina Pepiada, Pabellón, Llanera, carne mechada and cheese, from $9.99. Breakfast and lunch at Venemex.',
      crumb: 'Arepas',
      eyebrow: 'Venezuelan Food · Daytona Beach',
      h1: 'Venezuelan Arepas in Daytona Beach',
      lead: 'Arepas (Venezuelan corn cakes) made from corn flour, split open and stuffed to order.',
      intro: [
        'An arepa is Venezuela’s everyday bread: a round corn cake made from corn flour, split open and filled. At Venemex, our Venezuelan restaurant on Seabreeze Blvd, you can keep it simple with an Arepa de Queso or try the classics — the Reina Pepiada (shredded chicken with avocado), the Arepa Pabellón (shredded beef, black beans, sweet plantain and white cheese) or the Arepa La Pelúa (shredded beef with white cheese).',
        'Our customer favorite is the Arepa Llanera: grilled beef, grilled chicken, queso de mano (hand cheese) and guasacaca, a Venezuelan avocado sauce. Arepas start at $9.99, and from 8 to 11 AM the Arepa con Huevo y Jamón comes with a café con leche as a breakfast combo.',
        'Want something different? Try our <a href="/#sec-patacones">patacones</a> — crispy fried green plantain used as the bread.'
      ],
      menuTitle: 'Our <em>Arepas</em>',
      faq: [
        ['What is an arepa?', 'A Venezuelan corn cake made from corn flour, split open and filled — with cheese, shredded beef, shredded chicken, avocado and more.'],
        ['Which arepa should I try first?', 'Our customer favorite is the Arepa Llanera: grilled beef, grilled chicken, queso de mano and guasacaca. For a classic, go with the Reina Pepiada or the Arepa Pabellón.'],
        ['Do you have a vegetarian arepa?', 'Yes — the Arepa de Queso, filled with white cheese.'],
        ['Can I get arepas for breakfast?', 'Yes. From 8 to 11 AM, the Arepa con Huevo y Jamón comes with a café con leche for $13.99.'],
        ['Can I order arepas for takeout?', `Yes — order for pickup or delivery through DoorDash with the Order Now button, on Uber Eats, or call us at ${PHONE}.`]
      ]
    },
    es: {
      title: 'Arepas Venezolanas en Daytona Beach | Venemex',
      description: 'Arepas venezolanas en Daytona Beach: Reina Pepiada, Pabellón, Llanera, carne mechada y queso, desde $9.99. Desayunos y almuerzos en Venemex.',
      crumb: 'Arepas',
      eyebrow: 'Comida Venezolana · Daytona Beach',
      h1: 'Arepas Venezolanas en Daytona Beach',
      lead: 'Arepas de harina de maíz, abiertas y rellenas al momento.',
      intro: [
        'La arepa es el pan de cada día en Venezuela: una torta redonda de harina de maíz que se abre y se rellena. En Venemex, nuestro restaurante venezolano en Seabreeze Blvd, puedes pedirla sencilla, como la Arepa de Queso, o probar las clásicas — la Reina Pepiada (pollo mechado con aguacate), la Arepa Pabellón (carne mechada, frijol negro, plátano y queso blanco) o la Arepa La Pelúa (carne mechada y queso blanco).',
        'La favorita del público es la Arepa Llanera: carne asada, pollo asado, queso de mano y guasacaca. Las arepas empiezan en $9.99, y de 8 a 11 AM la Arepa con Huevo y Jamón viene con café con leche como combo de desayuno.',
        '¿Quieres algo distinto? Prueba nuestros <a href="/es/#sec-patacones">patacones</a> — plátano verde frito y crujiente en lugar del pan.'
      ],
      menuTitle: 'Nuestras <em>Arepas</em>',
      faq: [
        ['¿Qué es una arepa?', 'Una torta de harina de maíz típica de Venezuela que se abre y se rellena — con queso, carne mechada, pollo mechado, aguacate y más.'],
        ['¿Qué arepa pruebo primero?', 'La favorita del público es la Arepa Llanera: carne asada, pollo asado, queso de mano y guasacaca. Si prefieres una clásica, pide la Reina Pepiada o la Arepa Pabellón.'],
        ['¿Tienen arepa vegetariana?', 'Sí — la Arepa de Queso, rellena de queso blanco.'],
        ['¿Puedo pedir arepas en el desayuno?', 'Sí. De 8 a 11 AM, la Arepa con Huevo y Jamón viene con café con leche por $13.99.'],
        ['¿Puedo pedir arepas para llevar?', `Sí — pide para pickup o delivery por DoorDash con el botón Ordenar, por Uber Eats o llámanos al ${PHONE}.`]
      ]
    }
  },

  empanadas: {
    paths: { en: '/empanadas-daytona-beach/', es: '/es/empanadas-daytona-beach/' },
    cards: [['sec-empanadas'], ['sec-combos', /Combo #2/]],
    ogImage: '/assets/empanada-carne-mechada.jpg',
    en: {
      title: 'Venezuelan Empanadas in Daytona Beach | Venemex',
      description: 'Venezuelan cornmeal empanadas in Daytona Beach with cheese, shredded beef or shredded chicken, $4.50 each. Order for pickup or delivery at Venemex.',
      crumb: 'Empanadas',
      eyebrow: 'Venezuelan Food · Daytona Beach',
      h1: 'Venezuelan Empanadas in Daytona Beach',
      lead: 'Venezuelan cornmeal empanadas with cheese, shredded beef or shredded chicken — $4.50 each.',
      intro: [
        'Our empanadas are made the Venezuelan way, with cornmeal dough folded around a savory filling. Choose white cheese, carne mechada (shredded beef) or pollo mechado (shredded chicken) — every empanada is $4.50.',
        'Pair them with a Malta or a Frescolita, or get two empanadas with two tacos in the Venemex Combo #2 (available 10 AM–1 PM). Find us at 201 Seabreeze Blvd, Daytona Beach, Tuesday through Sunday.'
      ],
      menuTitle: 'Our <em>Empanadas</em>',
      faq: [
        ['How much are empanadas at Venemex?', '$4.50 each, for any filling.'],
        ['What fillings do you have?', 'White cheese (queso), shredded beef (carne mechada) and shredded chicken (pollo mechado).'],
        ['What are Venezuelan empanadas made of?', 'The dough is made with cornmeal, which is what makes Venezuelan empanadas different from the wheat-flour kind.'],
        ['Can I order empanadas for takeout?', `Yes — order for pickup or delivery through DoorDash with the Order Now button, on Uber Eats, or call us at ${PHONE}.`]
      ]
    },
    es: {
      title: 'Empanadas Venezolanas en Daytona Beach | Venemex',
      description: 'Empanadas venezolanas de maíz en Daytona Beach, de queso, carne mechada o pollo mechado, a $4.50 cada una. Pide para pickup o delivery en Venemex.',
      crumb: 'Empanadas',
      eyebrow: 'Comida Venezolana · Daytona Beach',
      h1: 'Empanadas Venezolanas en Daytona Beach',
      lead: 'Empanadas venezolanas de maíz de queso, carne mechada o pollo mechado — $4.50 cada una.',
      intro: [
        'Nuestras empanadas son a la venezolana: masa de maíz cerrada sobre un buen relleno. Elige queso blanco, carne mechada o pollo mechado — cada empanada cuesta $4.50.',
        'Acompáñalas con una Malta o una Frescolita, o pide dos empanadas con dos tacos en el Venemex Combo #2 (disponible de 10 AM a 1 PM). Estamos en 201 Seabreeze Blvd, Daytona Beach, de martes a domingo.'
      ],
      menuTitle: 'Nuestras <em>Empanadas</em>',
      faq: [
        ['¿Cuánto cuestan las empanadas en Venemex?', '$4.50 cada una, de cualquier relleno.'],
        ['¿Qué rellenos tienen?', 'Queso blanco, carne mechada y pollo mechado.'],
        ['¿De qué son las empanadas venezolanas?', 'La masa es de maíz, que es lo que diferencia a la empanada venezolana de las de harina de trigo.'],
        ['¿Puedo pedir empanadas para llevar?', `Sí — pide para pickup o delivery por DoorDash con el botón Ordenar, por Uber Eats o llámanos al ${PHONE}.`]
      ]
    }
  },

  desserts: {
    paths: { en: '/desserts-daytona-beach/', es: '/es/postres-daytona-beach/' },
    cards: [['sec-postres']],
    ogImage: '/assets/triple-chocolate-cake.jpg',
    en: {
      title: 'Desserts & Pastries in Daytona Beach | Venemex Bakery',
      description: 'Flan, chocoflán, tres leches, cheesecakes, red velvet and triple chocolate cake, golfeados and pan dulce at Venemex Bakery & Café in Daytona Beach.',
      crumb: 'Desserts',
      eyebrow: 'Bakery · Daytona Beach',
      h1: 'Desserts & Pastries in Daytona Beach',
      lead: 'Venezuelan & Latin pastries, cakes and flan, baked fresh daily at Venemex Bakery & Café.',
      intro: [
        'Our bakery case brings together Venezuelan, Mexican and Latin American favorites, baked fresh daily: classic caramel flan and chocoflán, tres leches, creamy cheesecakes (including mango, blueberry and churro cheesecake), red velvet, dulce de leche and triple chocolate cakes, and tiramisú.',
        'From the bakery side: Venezuelan golfeados and cachitos, pan de queso, Mexican conchas and pan dulce, pan de guayaba, croissants, alfajores, cookies and cinnamon rolls — perfect with a café con leche. Prices start at $1.99; ask in store for today’s pan dulce.'
      ],
      menuTitle: 'Desserts &amp; <em>Pastries</em>',
      faq: [
        ['Do you have flan?', 'Yes — a classic caramel flan ($6.99) and chocoflán, a chocolate flan ($7.99).'],
        ['What Venezuelan pastries do you have?', 'Golfeado (a sweet roll with anise and papelón syrup), cachito (a ham-filled roll), pan de queso and pan de guayaba, among others.'],
        ['What cakes do you have?', 'Tres leches, red velvet, dulce de leche and triple chocolate cake, plus several cheesecakes: classic, mango, blueberry and churro cheesecake.'],
        ['Can I order desserts for pickup or delivery?', `Yes — through DoorDash with the Order Now button, on Uber Eats, or call us at ${PHONE}.`]
      ]
    },
    es: {
      title: 'Postres y Panadería en Daytona Beach | Venemex',
      description: 'Flan, chocoflán, tres leches, cheesecakes, torta red velvet y triple chocolate, golfeados y pan dulce en Venemex Bakery & Café, Daytona Beach.',
      crumb: 'Postres',
      eyebrow: 'Panadería · Daytona Beach',
      h1: 'Postres y Panadería en Daytona Beach',
      lead: 'Postres venezolanos y latinoamericanos, tortas y flan, frescos cada día en Venemex Bakery & Café.',
      intro: [
        'Nuestra vitrina reúne favoritos venezolanos, mexicanos y latinoamericanos, frescos cada día: flan de caramelo y chocoflán, tres leches, cheesecakes cremosos (de mango, de arándanos y churro cheesecake, entre otros), tortas red velvet, de dulce de leche y triple chocolate, y tiramisú.',
        'De la panadería: golfeados y cachitos venezolanos, pan de queso, conchas y pan dulce mexicano, pan de guayaba, croissants, alfajores, galletas y rolls de canela — perfectos con un café con leche. Desde $1.99; pregunta en tienda por el pan dulce del día.'
      ],
      menuTitle: 'Postres y <em>Panadería</em>',
      faq: [
        ['¿Tienen flan?', 'Sí — flan de caramelo clásico ($6.99) y chocoflán, flan de chocolate ($7.99).'],
        ['¿Qué panes venezolanos tienen?', 'Golfeado (pan dulce con anís y papelón), cachito (panecillo relleno de jamón), pan de queso y pan de guayaba, entre otros.'],
        ['¿Qué tortas tienen?', 'Tres leches, red velvet, dulce de leche y triple chocolate, además de varios cheesecakes: clásico, de mango, de arándanos y churro cheesecake.'],
        ['¿Puedo pedir postres para pickup o delivery?', `Sí — por DoorDash con el botón Ordenar, por Uber Eats o llámanos al ${PHONE}.`]
      ]
    }
  }
};
