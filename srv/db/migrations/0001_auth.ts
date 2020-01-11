import { Client } from '../client'

export async function up(db: Client) {
  const hasUsers = await db.schema.hasTable('users')
  if (!hasUsers) {
    await db.schema.createTable('users', tbl => {
      tbl.text('user_id').primary()
      tbl.text('hash')
    })
  }

  const hasTokens = await db.schema.hasTable('tokens')

  if (!hasTokens) {
    await db.schema.createTable('tokens', tbl => {
      tbl.text('user_id').index()
      tbl
        .text('token')
        .index()
        .unique()
    })
  }
}

export async function down() {}
