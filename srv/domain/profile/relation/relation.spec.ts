import * as promised from 'chai-as-promised'
import { expect, use } from 'chai'
import { profiles } from '..'
import { migrate } from '../../../db'
import { Relation } from './types'

use(promised)

const cmd = profiles.relations.cmd

describe('relation domain', () => {
  before(prepare)

  it('will fail to request for invalid users', async () => {
    const left = 'left'
    const right = 'right'
    const id = `${left}-${right}`
    const command = cmd.RequestRelation(id, {
      left: { userId: left, relation: Relation.Sibling },
      right: { userId: right, relation: Relation.Sibling },
    })

    await expect(command).to.be.eventually.rejected
  })

  it('will create a request for valid users', async () => {
    const left = 'aaa'
    const right = 'bbb'
    const id = `${left}-${right}`
    const command = cmd.RequestRelation(id, {
      left: { userId: left, relation: Relation.Sibling },
      right: { userId: right, relation: Relation.Sibling },
    })

    await expect(command).to.be.eventually.fulfilled
  })

  it('will reject for a request already pending', async () => {
    const command = cmd.RequestRelation('aaa-bbb', {
      left: { userId: 'aaa', relation: Relation.Sibling },
      right: { userId: 'bbb', relation: Relation.Sibling },
    })
    await expect(command).to.be.eventually.rejected
  })
})

async function prepare() {
  await migrate()
}
