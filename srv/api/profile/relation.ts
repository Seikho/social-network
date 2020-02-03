import { handle, ServiceRequest, StatusError } from 'svcready'
import { profiles } from '../../domain/profile'
import { isRelation } from './util'

type Body = {
  left: string
  right: string
}

const cmd = profiles.relations.cmd

export const request = handle(async (req, res) => {
  const { leftId, rightId, aggId } = toIds(req)
  const { left, right }: Body = req.body

  isRelation(left)
  isRelation(right)

  await cmd.RequestRelation(aggId, {
    left: { userId: leftId, relation: left },
    right: { userId: rightId, relation: right },
  })

  res.json({ message: 'ok' })
})

export const accept = handle(async (req, res) => {
  const { leftId, rightId, aggId } = toIds(req)

  await cmd.AcceptRelation(aggId, { leftId, rightId })
  res.json({ message: 'ok' })
})

export const reject = handle(async (req, res) => {
  const { leftId, rightId, aggId } = toIds(req)
  await cmd.RejectRelation(aggId, { leftId, rightId })
  res.json({ message: 'ok' })
})

export const remove = handle(async (req, res) => {
  const { leftId, rightId, aggId } = toIds(req)
  await cmd.RemoveRelation(aggId, { leftId, rightId })
  res.json({ message: 'ok' })
})

function toIds(req: ServiceRequest) {
  if (!req.session.userId) throw new StatusError('Unauthorized', 401)
  if (!req.params.id) throw new StatusError('User not provided', 400)

  const leftId: string = req.session.userId
  const rightId: string = req.params.id

  return {
    leftId,
    rightId,
    aggId: `${leftId}-${rightId}`,
  }
}
