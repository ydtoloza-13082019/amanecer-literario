require('../src/config/env');

const fs = require('fs');
const { sequelize, Categoria, Libro, Inventario } = require('../src/models');
const ensureSingleActiveCartConstraint = require('../src/config/cartConstraint');

const SOURCE_FILE =
  process.argv[2] ||
  'C:/Users/yamith/Desktop/san mateo/cuarto semestre/proyecto/basededatoslibros.json';

const DEFAULT_PRICE = Number(process.env.IMPORT_DEFAULT_PRICE || 0);
const DEFAULT_STOCK = Number(process.env.IMPORT_DEFAULT_STOCK || 10);

function trimTo(value, length) {
  return String(value || '').trim().slice(0, length);
}

function normalizeBook(raw, index) {
  const isbn = trimTo(raw.isbn13 || raw.isbn10 || `NOISBN-${index + 1}`, 20);
  const title = trimTo(raw.title || 'Libro sin titulo', 150);
  const authors = Array.isArray(raw.authors) && raw.authors.length > 0
    ? raw.authors.join(', ')
    : 'Autor desconocido';
  const categories = Array.isArray(raw.categories) && raw.categories.length > 0
    ? raw.categories
    : ['Sin categoria'];

  const extraDetails = [
    raw.subtitle ? `Subtitulo: ${raw.subtitle}` : null,
    raw.published_year ? `Ano de publicacion: ${raw.published_year}` : null,
    raw.num_pages ? `Paginas: ${raw.num_pages}` : null,
    raw.average_rating ? `Calificacion promedio: ${raw.average_rating}` : null,
    raw.ratings_count ? `Cantidad de calificaciones: ${raw.ratings_count}` : null,
    raw.thumbnail ? `Portada: ${raw.thumbnail}` : null
  ].filter(Boolean);

  return {
    isbn,
    titulo: title,
    autor: trimTo(authors, 120),
    categoria: trimTo(categories[0], 100) || 'Sin categoria',
    precio: DEFAULT_PRICE,
    descripcion: [raw.description || '', ...extraDetails].filter(Boolean).join('\n\n')
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Falta DATABASE_URL. Define la URL de Supabase antes de ejecutar la importacion.');
  }

  const rawBooks = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));

  if (!Array.isArray(rawBooks)) {
    throw new Error('El archivo JSON debe contener un arreglo de libros.');
  }

  await sequelize.authenticate();
  await sequelize.sync();
  await ensureSingleActiveCartConstraint(sequelize);

  const categoryCache = new Map();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (let index = 0; index < rawBooks.length; index += 1) {
    const book = normalizeBook(rawBooks[index], index);

    if (!book.isbn || !book.titulo || !book.autor) {
      skipped += 1;
      continue;
    }

    let categoria = categoryCache.get(book.categoria);

    if (!categoria) {
      [categoria] = await Categoria.findOrCreate({
        where: { nombre: book.categoria },
        defaults: {
          nombre: book.categoria,
          descripcion: `Categoria importada desde ${SOURCE_FILE}`
        }
      });
      categoryCache.set(book.categoria, categoria);
    }

    const [libro, wasCreated] = await Libro.findOrCreate({
      where: { isbn: book.isbn },
      defaults: {
        titulo: book.titulo,
        autor: book.autor,
        isbn: book.isbn,
        precio: book.precio,
        descripcion: book.descripcion,
        categoria_id: categoria.id,
        activo: true
      }
    });

    if (wasCreated) {
      created += 1;
    } else {
      await libro.update({
        titulo: book.titulo,
        autor: book.autor,
        precio: book.precio,
        descripcion: book.descripcion,
        categoria_id: categoria.id,
        activo: true
      });
      updated += 1;
    }

    await Inventario.findOrCreate({
      where: {
        libro_id: libro.id,
        ubicacion_tipo: 'almacen',
        ubicacion_id: 0
      },
      defaults: {
        libro_id: libro.id,
        ubicacion_tipo: 'almacen',
        ubicacion_id: 0,
        stock: DEFAULT_STOCK
      }
    });

    if ((index + 1) % 500 === 0) {
      console.log(`Procesados ${index + 1}/${rawBooks.length}`);
    }
  }

  console.log(JSON.stringify({
    total: rawBooks.length,
    created,
    updated,
    skipped,
    categories: categoryCache.size,
    defaultPrice: DEFAULT_PRICE,
    defaultStock: DEFAULT_STOCK
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
