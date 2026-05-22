async function ensureSingleActiveCartConstraint(sequelize) {
  const activeValue = sequelize.getDialect() === 'postgres' ? 'true' : '1';

  const [activeCarts] = await sequelize.query(`
    SELECT id, usuario_id
    FROM carritos
    WHERE activo = ${activeValue}
    ORDER BY usuario_id ASC, id DESC
  `);

  const seenUsers = new Set();
  const idsToDeactivate = [];

  for (const cart of activeCarts) {
    if (seenUsers.has(cart.usuario_id)) {
      idsToDeactivate.push(cart.id);
    } else {
      seenUsers.add(cart.usuario_id);
    }
  }

  if (idsToDeactivate.length > 0) {
    await sequelize.query(
      `
      UPDATE carritos
      SET activo = false
      WHERE id IN (:ids)
      `,
      {
        replacements: { ids: idsToDeactivate }
      }
    );
  }

  const dialect = sequelize.getDialect();
  let indexes;

  if (dialect === 'postgres') {
    [indexes] = await sequelize.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'carritos'
        AND indexname = 'uq_carritos_usuario_activo'
    `);
  } else {
    [indexes] = await sequelize.query(
      `
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'carritos'
        AND INDEX_NAME = 'uq_carritos_usuario_activo'
      `
    );
  }

  if (indexes.length === 0) {
    const createIndexSql =
      dialect === 'postgres'
        ? `
          CREATE UNIQUE INDEX uq_carritos_usuario_activo
          ON carritos (usuario_id)
          WHERE activo = true
        `
        : `
          CREATE UNIQUE INDEX uq_carritos_usuario_activo
          ON carritos ((CASE WHEN activo = 1 THEN usuario_id ELSE NULL END))
        `;

    await sequelize.query(createIndexSql);
  }
}

module.exports = ensureSingleActiveCartConstraint;
