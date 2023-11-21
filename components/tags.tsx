'use client'

import {useQuery} from '@tanstack/react-query'
import {useEffect} from 'react'

// import {TagDialog} from '@/components/tag-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {getTags} from '@/lib/api'

export function Tags({userId}: {userId?: string}) {
  const {data: tags} = useQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
    refetchInterval: 2500,
  })

  useEffect(() => {
    console.log({tags})
  }, [tags])

  return (
    <Card>
      <CardHeader>
        <CardDescription>Pick a tag for this time (optional).</CardDescription>
        {/*<TagDialog userId={userId} />*/}
      </CardHeader>
      {!!tags?.length && (
        <CardContent className="grid gap-6">
          <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="none" id="none" className="peer sr-only" />
              <Label
                htmlFor="none"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                {' '}
                None
              </Label>
            </div>
            {tags.map(tag => (
              <div key={tag.id}>
                <RadioGroupItem
                  value={tag.name}
                  id={tag.name}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={tag.name}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {tag.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      )}
    </Card>
  )
}
