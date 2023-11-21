import {auth} from '@/auth'
import ClockInButton from '@/components/clock-in-button'
// import {Tags} from '@/components/tags'
// import {db} from '@/lib/db'

// const getTags = async (id?: string) => {
//   if (!id) {
//     return {tags: []}
//   }
//
//   const tags = await db.tag.findMany({
//     where: {
//       userId: id,
//       deleted: false,
//     },
//   })
//
//   return {tags}
// }

export default async function Home() {
  const session = await auth()
  // const {tags} = await getTags(session?.user?.id)
  const userId = session?.user?.id

  return <ClockInButton userId={userId} />
}
