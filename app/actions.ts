'use server'

import {redirect} from 'next/navigation'

import {signIn} from '@/auth'

export async function signInAction() {
  'use server'
  const url = await signIn(undefined, {redirect: false})
  // TODO: fix in next-auth
  redirect(url.replace('signin', 'api/auth/signin'))
}
