export function buildGroupList(groups) {
  return groups
    .map(group => group.description)
    .filter(Boolean)
}

export function applyWebEdit(groups, edit) {
  const nextGroups = cloneGroups(groups)
  const groupDescription = sanitize(edit.groupDescription)
  const webDescription = sanitize(edit.webDescription)
  const webUrl = sanitize(edit.webUrl)

  const targetGroupIndex = buildGroupList(nextGroups).indexOf(groupDescription)

  if (targetGroupIndex === -1) {
    if (edit.type === 'update') {
      removeWeb(nextGroups, edit.groupIndex, edit.webIndex)
    }

    nextGroups.push({
      description: groupDescription,
      webs: [{ url: webUrl, description: webDescription }],
    })
    return nextGroups
  }

  if (targetGroupIndex !== edit.groupIndex) {
    if (edit.type === 'update') {
      removeWeb(nextGroups, edit.groupIndex, edit.webIndex)
    }

    nextGroups[targetGroupIndex].webs.push({ url: webUrl, description: webDescription })
    return nextGroups
  }

  nextGroups[edit.groupIndex].webs[edit.webIndex] = {
    ...nextGroups[edit.groupIndex].webs[edit.webIndex],
    description: webDescription,
    url: webUrl,
  }
  return nextGroups
}

export function moveWeb(groups, move) {
  const nextGroups = cloneGroups(groups)
  const sourceGroup = nextGroups[move.fromGroupIndex]
  const targetGroup = nextGroups[move.toGroupIndex]

  if (!sourceGroup || !targetGroup) {
    return nextGroups
  }

  const [item] = sourceGroup.webs.splice(move.fromWebIndex, 1)
  if (!item) {
    return nextGroups
  }

  if (move.fromGroupIndex === move.toGroupIndex && move.toWebIndex > move.fromWebIndex) {
    targetGroup.webs.splice(move.toWebIndex - 1, 0, item)
  }
  else {
    targetGroup.webs.splice(move.toWebIndex, 0, item)
  }

  if (sourceGroup.webs.length === 0) {
    nextGroups.splice(move.fromGroupIndex, 1)
  }

  return nextGroups
}

export function moveGroup(groups, fromIndex, toIndex) {
  const nextGroups = cloneGroups(groups)
  const [item] = nextGroups.splice(fromIndex, 1)

  if (!item) {
    return nextGroups
  }

  const insertIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
  nextGroups.splice(insertIndex, 0, item)
  return nextGroups
}

function cloneGroups(groups) {
  return groups.map(group => ({
    ...group,
    webs: group.webs.map(web => ({ ...web })),
  }))
}

function removeWeb(groups, groupIndex, webIndex) {
  const webs = groups[groupIndex]?.webs

  if (!webs) {
    return
  }

  webs.splice(webIndex, 1)

  if (webs.length === 0) {
    groups.splice(groupIndex, 1)
  }
}

function sanitize(value) {
  return String(value ?? '').replace(/\s+/g, '')
}
