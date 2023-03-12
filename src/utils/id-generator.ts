// Uses the user's initials along with their index when inserted into in-memory cache
// Takes into account archived users when incrementing the index
export function generateReferenceId(firstName: string, lastName: string, totalUsers: number) {
  return `${ firstName[0] }${ lastName[0] }-${ totalUsers + 1 }`;
}