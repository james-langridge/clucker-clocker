import {Tag} from '@prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'

import {useToast} from '@/components/ui/use-toast'
import {createTag, getTags} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function useTag() {
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {mutate: createTagMutation} = useMutation({
    mutationFn: createTag,
    onMutate: async newTag => {
      toast({
        description: 'Tag created!',
      })
      await queryClient.cancelQueries({queryKey: ['tags']})
      const previousTags = queryClient.getQueryData<Tag[]>(['tags'])
      queryClient.setQueryData(['tags'], old => {
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
      queryClient.setQueryData(['tags'], context?.previousTags)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['tags']})
    },
  })

  // This is prefetched on the server in app/page.tsx
  const {data: tags} = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    refetchInterval: 60 * 1000,
  })

  return {createTagMutation, tags}
}
