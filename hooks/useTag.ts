import {Tag} from '@prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'

import {useToast} from '@/components/ui/use-toast'
import {createTag, getTags} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function useTag({userId}: {userId?: string}) {
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {mutate: createTagMutation} = useMutation({
    mutationFn: createTag,
    onMutate: () => {
      toast({
        description: 'Tag created!',
      })
    },
    onSuccess: newTag => {
      queryClient.setQueryData<Tag[]>(['tags', userId], prev => {
        if (!Array.isArray(prev)) {
          throw new Error('Expected an array of tags')
        }

        return [...prev, newTag]
      })
    },
    onError: error => {
      toast({
        title: 'Error creating tag...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const {data: tags} = useQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
    refetchInterval: 1000,
  })

  return {createTagMutation, tags}
}
