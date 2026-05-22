async function ensureSingleActiveCartConstraint(sequelize) {
  const [activeCarts] = await sequelize.query(`
    SELECT id, usuario_id
    FROM carritos
    WHERE activo = 1
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
      SET activo = 0
      WHERE id IN (:ids)
      `,
      {
        replacements: { ids: idsToDeactivate }
      }
    );
  }

  const [indexes] = await sequelize.query(
    `
    SELECT INDEX_NAME
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'carritos'
      AND INDEX_NAME = 'uq_carritos_usuario_activo'
    `
  );

  if (indexes.length === 0) {
    await sequelize.query(`
      CREATE UNIQUE INDEX uq_carritos_usuario_activo
      ON carritos ((CASE WHEN activo = 1 THEN usuario_id ELSE NULL END))
    `);
  }
}

module.exports = ensureSingleActiveCartConstraint;
