import { Client, tables } from '../client'

export async function up(db: Client) {
  const hasUsers = await db.schema.hasTable(tables.users)
  if (!hasUsers) {
    await db.schema.createTable(tables.users, tbl => {
      tbl.text('user_id').primary()
      tbl.text('hash')
    })
  }
}

export async function down() {}
