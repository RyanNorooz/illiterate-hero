export function getDirtyValues<
  DirtyFields extends Record<string, DirtyFields | boolean | undefined>,
  Values extends Partial<Record<keyof DirtyFields, unknown>>,
>(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
  return Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RHF sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === 'object'
          ? getDirtyValues(dirtyFields[key] as DirtyFields, values[key] as Values)
          : values[key],
    }
  }, {})
}

// export function getDiff<OldObj extends Record<string, unknown>, NewObj extends Partial<OldObj>>(
//   oldObj: OldObj,
//   newObj: NewObj
// ): Partial<typeof newObj> {
//   return Object.entries(newObj).reduce(
//     (acc, [key, val]) => ({
//       ...acc,
//       [key]:
//         typeof oldObj[key] === 'object'
//           ? getDiff(oldObj[key] as OldObj, val)
//           : oldObj[key] !== val
//           ? val
//           : {},
//     }),
//     {}
//   )
// }
