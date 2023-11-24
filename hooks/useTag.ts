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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tags', userId]})
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
    refetchInterval: 2500,
  })

  return {createTagMutation, tags}
}
