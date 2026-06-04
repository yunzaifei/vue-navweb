import { describe, expect, it } from 'vitest'
import {
  applyWebEdit,
  buildGroupList,
  moveGroup,
  moveWeb,
} from './webgroup'

const sampleGroups = () => [
  {
    description: 'Dev',
    webs: [
      { description: 'GitHub', url: 'https://github.com' },
      { description: 'Vue', url: 'https://vuejs.org' },
    ],
  },
  {
    description: 'Tools',
    webs: [
      { description: 'Gist', url: 'https://gist.github.com' },
    ],
  },
]

describe('webgroup utilities', () => {
  it('builds group descriptions from existing data', () => {
    expect(buildGroupList(sampleGroups())).toEqual(['Dev', 'Tools'])
  })

  it('adds a web to a new group', () => {
    const result = applyWebEdit(sampleGroups(), {
      type: 'add',
      groupIndex: -1,
      webIndex: -1,
      groupDescription: 'Docs',
      webDescription: 'Vue Router',
      webUrl: 'https://router.vuejs.org',
    })

    expect(result).toHaveLength(3)
    expect(result[2]).toEqual({
      description: 'Docs',
      webs: [{ description: 'VueRouter', url: 'https://router.vuejs.org' }],
    })
  })

  it('moves a web between groups and removes an empty source group', () => {
    const result = moveWeb(sampleGroups(), {
      fromGroupIndex: 1,
      fromWebIndex: 0,
      toGroupIndex: 0,
      toWebIndex: 1,
    })

    expect(result).toEqual([
      {
        description: 'Dev',
        webs: [
          { description: 'GitHub', url: 'https://github.com' },
          { description: 'Gist', url: 'https://gist.github.com' },
          { description: 'Vue', url: 'https://vuejs.org' },
        ],
      },
    ])
  })

  it('moves a group before the target group', () => {
    expect(moveGroup(sampleGroups(), 1, 0).map(group => group.description)).toEqual(['Tools', 'Dev'])
  })
})
