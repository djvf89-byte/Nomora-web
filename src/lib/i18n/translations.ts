export type Locale = "es" | "en"

export const LOCALES: Locale[] = ["es", "en"]

export const translations = {
  es: {
    nav: {
      admin: "Ingreso administrador",
      cart: "Carrito",
      cartPending: "tienes un pedido pendiente por terminar",
      marquee: [
        "Envío {b}gratis{/b} en Lima y Callao desde S/100",
        "Diseñado y hecho {b}en el Perú{/b}",
        "Cada toalla lleva un {b}lugar real del Perú{/b}",
      ],
    },
    hero: {
      eyebrow: "Explora · Vive · Recuerda · Comparte",
      headline1: "Empieza",
      headline2: "tu ruta.",
      deck: "Nomora no es para todos. Es para quienes no se quedan quietos: productos para la aventura, sin atarse a un solo terreno.",
      ctaPrimary: "Explorar catálogo",
    },
    statement: {
      eyebrow: "El concepto",
      quote: "No es lo que compras. Es lo que empiezas.",
    },
    catalog: {
      eyebrow: "Catálogo inicial",
      heading: "Elige tu compañero de ruta.",
      subheading:
        "Cada pieza está pensada para acompañarte, no para quedarse guardada. Stock real, listo para tu próxima salida.",
      from: "Desde",
      pageTitle: "Catálogo",
      pageSubtitle: "Productos para la aventura, con stock por variante y envío gratis en Lima y Callao desde S/100.",
    },
    comoFunciona: {
      eyebrow: "Álbum de aventuras",
      heading: "Tu tomatodo, tu bitácora.",
      subheading: "Cada salida deja una marca física. El sticker no se descarga: se pega.",
      steps: [
        {
          titulo: "Compra tu tomatodo",
          texto: "Llega con un set de stickers coleccionables incluido, sin costo extra.",
        },
        {
          titulo: "Vive la ruta",
          texto: "Playa, montaña o lo que se te ocurra. Nomora no elige el terreno, tú sí.",
        },
        {
          titulo: "Pega, guarda, comparte",
          texto: "Cada aventura suma un sticker a tu botella. El álbum crece contigo.",
        },
      ],
    },
    trust: {
      items: [
        {
          titulo: "Envío gratis en Lima y Callao",
          texto: "Desde S/100 en compras dentro de Lima y Callao. Para provincia, el costo se calcula según destino.",
        },
        { titulo: "Inventario propio", texto: "Sin intermediarios: lo que compras, lo despachamos nosotros." },
      ],
    },
    footer: {
      tagline: "Productos para la aventura, hechos para quienes no se quedan quietos. Empieza tu ruta.",
      tienda: "Tienda",
      catalogo: "Catálogo",
      newsletterTitle: "Recibe novedades",
      emailPlaceholder: "tu@email.com",
      subscribe: "Sumarme",
      rights: "© 2026 Nomora — Lima, Perú",
      playlistTitle: "La playlist de tu ruta",
      terminos: "Términos y condiciones",
      privacidad: "Privacidad",
    },
    login: {
      backToStore: "Volver a la tienda",
      title: "Acceso administrador",
      subtitle: "Este ingreso es solo para el equipo NOMORA. Para comprar no necesitas cuenta.",
      email: "Email",
      password: "Contraseña",
      submit: "Ingresar",
      submitting: "Ingresando...",
      passwordChanged: "Contraseña actualizada. Inicia sesión de nuevo.",
    },
    product: {
      backToCatalog: "← Volver al catálogo",
      size: "Talla",
      dimensions: "Medidas",
      color: "Color",
      design: "Diseño",
      designNote: "Cada diseño es un lugar real del Perú. Colecciónalos.",
      quantity: "Cantidad",
      quantityMinus: "Restar una unidad",
      quantityPlus: "Sumar una unidad",
      combinationUnavailable: "Combinación no disponible",
      available: "disponibles",
      soldOut: "Agotado",
      addToCart: "Agregar al carrito",
      addedToCart: "¡Agregado al carrito!",
      viewCart: "Ver carrito",
      noAccountNote: "Compra sin crear cuenta — solo pedimos tus datos en el checkout.",
    },
    cart: {
      title: "Tu carrito",
      empty: "Tu carrito está vacío.",
      emptyCta: "Ver catálogo",
      subtotal: "Subtotal",
      remove: "Quitar",
      continueToCheckout: "Continuar al pago",
      continueShopping: "Seguir explorando",
    },
    checkout: {
      title: "Checkout",
      yourOrder: "Tu pedido",
      quantity: "Cantidad",
      subtotal: "Subtotal",
      discount: "Descuento",
      shipping: "Envío",
      shippingFree: "Gratis",
      shippingPending: "Según destino",
      total: "Total",
      seasonOffer: "Oferta de temporada",
      couponLabel: "¿Tienes un cupón?",
      couponPlaceholder: "CÓDIGO",
      couponApply: "Aplicar",
      couponApplied: "Cupón aplicado:",
      couponInvalid: "Cupón no válido.",
      freeShippingUnlocked: "¡Envío gratis desbloqueado! 🎉",
      freeShippingMissingPrefix: "Te faltan S/",
      freeShippingMissingSuffix: " para envío gratis en Lima y Callao 🚚",
      shippingProvincia: "Costo de envío calculado según tu distrito/provincia.",
      fullName: "Nombre completo",
      email: "Email",
      phone: "Teléfono",
      address: "Dirección",
      departamento: "Departamento",
      provincia: "Provincia",
      district: "Distrito",
      selectPlaceholder: "Selecciona...",
      reference: "Referencia",
      optional: "(opcional)",
      paymentMethod: "Método de pago",
      methods: { YAPE: "Yape", TRANSFERENCIA_BANCARIA: "Transferencia bancaria", TARJETA: "Tarjeta (Visa/Mastercard)" },
      acceptTermsPrefix: "He leído y acepto los ",
      acceptTermsMiddle: " y la ",
      acceptTermsSuffix: ".",
      termsLinkLabel: "Términos y condiciones",
      privacyLinkLabel: "Política de privacidad",
      submit: "Confirmar pedido",
      submitting: "Procesando...",
    },
    confirm: {
      title: "¡Pedido recibido!",
      subtitlePrefix: "Te escribimos a",
      subtitleSuffix: "en cuanto confirmemos tu pago.",
      orderNumber: "Pedido",
      continueShopping: "Seguir explorando",
    },
  },
  en: {
    nav: {
      admin: "Admin login",
      cart: "Cart",
      cartPending: "you have an unfinished order",
      marquee: [
        "{b}Free shipping{/b} in Lima and Callao from S/100",
        "Designed and made {b}in Peru{/b}",
        "Every towel carries a {b}real spot in Peru{/b}",
      ],
    },
    hero: {
      eyebrow: "Explore · Live · Remember · Share",
      headline1: "Start",
      headline2: "your route.",
      deck: "Nomora isn't for everyone. It's for the ones who never sit still: gear for adventure, not tied to one terrain.",
      ctaPrimary: "Explore catalog",
    },
    statement: {
      eyebrow: "The concept",
      quote: "It's not what you buy. It's what you start.",
    },
    catalog: {
      eyebrow: "Launch catalog",
      heading: "Pick your travel companion.",
      subheading: "Every piece is built to come with you, not sit in a drawer. Real stock, ready for your next trip.",
      from: "From",
      pageTitle: "Catalog",
      pageSubtitle: "Gear for adventure, with real stock per variant and free shipping in Lima and Callao from S/100.",
    },
    comoFunciona: {
      eyebrow: "Adventure album",
      heading: "Your bottle, your logbook.",
      subheading: "Every trip leaves a physical mark. The sticker isn't downloaded: it's stuck on.",
      steps: [
        { titulo: "Buy your bottle", texto: "Comes with a set of collectible stickers included, at no extra cost." },
        { titulo: "Live the route", texto: "Beach, mountain, or whatever you come up with. Nomora doesn't pick the terrain, you do." },
        { titulo: "Stick, keep, share", texto: "Every adventure adds a sticker to your bottle. The album grows with you." },
      ],
    },
    trust: {
      items: [
        {
          titulo: "Free shipping in Lima and Callao",
          texto: "From S/100 on orders within Lima and Callao. For other regions, cost is calculated by destination.",
        },
        { titulo: "Our own inventory", texto: "No middlemen: what you buy, we ship ourselves." },
      ],
    },
    footer: {
      tagline: "Gear for adventure, made for the ones who never sit still. Start your route.",
      tienda: "Shop",
      catalogo: "Catalog",
      newsletterTitle: "Get updates",
      emailPlaceholder: "you@email.com",
      subscribe: "Sign up",
      rights: "© 2026 Nomora — Lima, Peru",
      playlistTitle: "The playlist for your route",
      terminos: "Terms and conditions",
      privacidad: "Privacy",
    },
    login: {
      backToStore: "Back to the store",
      title: "Admin access",
      subtitle: "This login is for the NOMORA team only. You don't need an account to buy.",
      email: "Email",
      password: "Password",
      submit: "Log in",
      submitting: "Logging in...",
      passwordChanged: "Password updated. Log in again.",
    },
    product: {
      backToCatalog: "← Back to catalog",
      size: "Size",
      dimensions: "Dimensions",
      color: "Color",
      design: "Design",
      designNote: "Every design is a real place in Peru. Collect them.",
      quantity: "Quantity",
      quantityMinus: "Decrease quantity",
      quantityPlus: "Increase quantity",
      combinationUnavailable: "Combination unavailable",
      available: "available",
      soldOut: "Sold out",
      addToCart: "Add to cart",
      addedToCart: "Added to cart!",
      viewCart: "View cart",
      noAccountNote: "Buy without creating an account — we only ask for your details at checkout.",
    },
    cart: {
      title: "Your cart",
      empty: "Your cart is empty.",
      emptyCta: "View catalog",
      subtotal: "Subtotal",
      remove: "Remove",
      continueToCheckout: "Continue to checkout",
      continueShopping: "Keep exploring",
    },
    checkout: {
      title: "Checkout",
      yourOrder: "Your order",
      quantity: "Quantity",
      subtotal: "Subtotal",
      discount: "Discount",
      shipping: "Shipping",
      shippingFree: "Free",
      shippingPending: "By destination",
      total: "Total",
      seasonOffer: "Seasonal offer",
      couponLabel: "Have a coupon?",
      couponPlaceholder: "CODE",
      couponApply: "Apply",
      couponApplied: "Coupon applied:",
      couponInvalid: "Invalid coupon.",
      freeShippingUnlocked: "Free shipping unlocked! 🎉",
      freeShippingMissingPrefix: "You need S/",
      freeShippingMissingSuffix: " more for free shipping in Lima and Callao 🚚",
      shippingProvincia: "Shipping cost calculated based on your district/province.",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      departamento: "Department",
      provincia: "Province",
      district: "District",
      selectPlaceholder: "Select...",
      reference: "Reference",
      optional: "(optional)",
      paymentMethod: "Payment method",
      methods: { YAPE: "Yape", TRANSFERENCIA_BANCARIA: "Bank transfer", TARJETA: "Card (Visa/Mastercard)" },
      acceptTermsPrefix: "I have read and accept the ",
      acceptTermsMiddle: " and the ",
      acceptTermsSuffix: ".",
      termsLinkLabel: "Terms and conditions",
      privacyLinkLabel: "Privacy policy",
      submit: "Confirm order",
      submitting: "Processing...",
    },
    confirm: {
      title: "Order received!",
      subtitlePrefix: "We'll email",
      subtitleSuffix: "as soon as we confirm your payment.",
      orderNumber: "Order",
      continueShopping: "Keep exploring",
    },
  },
}

interface ProductoTexto {
  nombre: string
  descripcion: string
  spec: string
  notaEspecial?: string
  etiquetaOferta?: string
}

export const PRODUCT_TRANSLATIONS: Record<string, { es: ProductoTexto; en: ProductoTexto }> = {
  tomatodo: {
    es: {
      nombre: "Tomatodo Nomora",
      descripcion:
        "Botella de acero con álbum de 40 stickers coleccionables incluido: un diseño por cada destino y experiencia del Perú — Machu Picchu, Laguna 69, Cañón del Colca, sandboard en Huacachina y más. Cada aventura que vives suma un sticker nuevo a tu álbum.",
      spec: "Acero · 750 ml · álbum de 40 stickers incluido",
    },
    en: {
      nombre: "Nomora Bottle",
      descripcion:
        "Steel bottle with a 40-sticker collectible album included: one design for every Peruvian destination and experience — Machu Picchu, Laguna 69, Colca Canyon, sandboarding in Huacachina, and more. Every adventure you live adds a new sticker to your album.",
      spec: "Steel · 750 ml · 40-sticker album included",
    },
  },
  "poncho-playero": {
    es: {
      nombre: "Poncho playero",
      descripcion:
        "Poncho de secado rápido para cambiarte en la playa o después del mar sin pasar frío. Incluye su propia bolsa de guardado (25 x 20 cm aprox.) para llevarlo sin ensuciar el resto de tu mochila.",
      spec: "Microfibra · secado rápido",
      notaEspecial: "Stock limitado · Nomora x Wai",
      etiquetaOferta: "¡Oferta!",
    },
    en: {
      nombre: "Beach poncho",
      descripcion:
        "Quick-dry poncho to change at the beach or after the water without getting cold. Comes with its own storage pouch (about 25 x 20 cm) so it doesn't get the rest of your bag wet.",
      spec: "Microfiber · quick-dry",
      notaEspecial: "Limited stock · Nomora x Wai",
      etiquetaOferta: "Sale!",
    },
  },
  "toalla-playa": {
    es: {
      nombre: "Toalla de playa",
      descripcion:
        "Toalla grande de secado rápido — y un lugar real del Perú estampado en cada diseño. Gocta, Lima, Máncora: elige la ruta que ya viviste o la que sigue en tu lista.",
      spec: "140 x 70 cm · secado rápido",
      notaEspecial: "Stock limitado · Nomora x Wai",
      etiquetaOferta: "¡Oferta!",
    },
    en: {
      nombre: "Beach towel",
      descripcion:
        "Large quick-dry towel — with a real Peruvian spot printed on every design. Gocta, Lima, Máncora: pick the route you've already lived, or the one still on your list.",
      spec: "140 x 70 cm · quick-dry",
      notaEspecial: "Limited stock · Nomora x Wai",
      etiquetaOferta: "Sale!",
    },
  },
  "medias-neopreno": {
    es: {
      nombre: "Medias de neopreno",
      descripcion: "Medias de neopreno para actividades acuáticas, protegen del frío y de superficies filosas.",
      spec: "Neopreno 3mm",
    },
    en: {
      nombre: "Neoprene socks",
      descripcion: "Neoprene socks for water activities, protect against cold and sharp surfaces.",
      spec: "3mm neoprene",
    },
  },
}

export const COLOR_TRANSLATIONS: Record<string, { es: string; en: string }> = {
  Negro: { es: "Negro", en: "Black" },
  Beige: { es: "Beige", en: "Beige" },
  "Verde oliva": { es: "Verde oliva", en: "Olive green" },
  Terracota: { es: "Terracota", en: "Rust" },
  Rosa: { es: "Rosa", en: "Pink" },
  Azul: { es: "Azul", en: "Blue" },
}

export const DISENO_TRANSLATIONS: Record<string, { es: string; en: string }> = {
  Gocta: { es: "Gocta", en: "Gocta" },
  Lima: { es: "Lima", en: "Lima" },
  "Máncora": { es: "Máncora", en: "Máncora" },
  Padel: { es: "Pádel", en: "Padel" },
  "Voley playa": { es: "Vóley playa", en: "Beach volleyball" },
}

export type Translations = typeof translations.es
