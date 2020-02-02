import { Client, tables } from '../client'

export async function up(db: Client) {
  const hasTable = await db.schema.hasTable(tables.profile)
  if (!hasTable) {
    await db.schema.createTable(tables.profile, tbl => {
      tbl.text('id').primary()
      tbl.text('nickname').index()
      tbl.timestamp('created')
      tbl.timestamp('seen')
      tbl.boolean('enabled')
      tbl.boolean('verified')
      tbl.text('status')
      tbl.text('description')

      tbl.json('settings')
    })
  }
}

export async function down() {}
