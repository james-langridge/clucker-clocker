import {Tag} from '@prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'

import {useUserId} from '@/app/user-id-provider'
import {useToast} from '@/components/ui/use-toast'
import {createTag, getTags} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function useTag() {
  const {userId} = useUserId()
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {mutate: createTagMutation} = useMutation({
    mutationFn: createTag,
    onMutate: async newTag => {
      toast({
        description: 'Tag created!',
      })
      await queryClient.cancelQueries({queryKey: ['tags', userId]})
      const previousTags = queryClient.getQueryData<Tag[]>(['tags', userId])
      queryClient.setQueryData(['tags', userId], old => {
        if (!Array.isArray(old)) {
          throw new Error('Expected an array of tags')
        }

        return [...old, {...newTag, id: -1}]
      })

      return {previousTags}
    },
    onError: (err, _, context) => {
      toast({
        title: 'Error creating tag...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(['tags', userId], context?.previousTags)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['tags', userId]})
    },
  })

  // This is prefetched on the server in app/page.tsx
  const {data: tags} = useQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
    refetchInterval: 60 * 1000,
  })

  return {createTagMutation, tags}
}
