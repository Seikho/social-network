import { relation } from './domain'
import { MemoryBookmark } from 'evtstore'

export const populator = relation.handler(MemoryBookmark)
