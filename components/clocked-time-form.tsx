'use client'

import {ClockedTime} from '.prisma/client'
import {zodResolver} from '@hookform/resolvers/zod'
import {Tag} from '@prisma/client'
import {format} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import * as z from 'zod'

import revalidate from '@/app/log/[id]/actions'
import {Button} from '@/components/ui/button'
import {Calendar} from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {toast} from '@/components/ui/use-toast'
import {createClockedTime, updateClockedTime} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'
import {clockOutDescription, cn} from '@/lib/utils'

function isValidTime(value: string) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

  return timeRegex.test(value)
}

interface AddTimeFormProps {
  tags: Tag[]
  time?: ClockedTime
}

export default function ClockedTimeForm({tags, time}: AddTimeFormProps) {
  const [startPopoverOpen, setStartPopoverOpen] = useState(false)
  const [endPopoverOpen, setEndPopoverOpen] = useState(false)
  const router = useRouter()
  const FormSchema = z.object({
    start: z
      .date({
        required_error: 'A start day is required.',
      })
      .nullable(),
    startTime: z.string().refine(value => isValidTime(value), {
      message: 'A start time is required.',
    }),
    end: z
      .date({
        required_error: 'An end day is required.',
      })
      .nullable(),
    endTime: z.string().refine(value => isValidTime(value), {
      message: 'An end time is required.',
    }),
    tagId: z
      .string()
      .refine(
        tagId => {
          return tags.some(tag => tag.id === tagId) || tagId === 'none'
        },
        {
          message: 'Tag does not exist.',
        },
      )
      .optional(),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      start: time?.start ?? undefined,
      end: time?.end ?? undefined,
      startTime: time?.start ? format(time.start, 'HH:mm') : '',
      endTime: time?.end ? format(time.end, 'HH:mm') : '',
      tagId: time?.tagId ?? undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.tagId === 'none') {
      data.tagId = undefined
    }

    const {start, startTime, endTime, end, tagId} = data
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    start?.setHours(startHours, startMinutes)
    end?.setHours(endHours, endMinutes)

    if (!start || !end) {
      return
    }

    if (time) {
      await updateClockedTime({start, end, tagId, id: time.id})

      await revalidate()
      router.back()
    } else {
      try {
        await createClockedTime({start, end, tagId})

        toast({
          title: 'Clocked out!',
          description: clockOutDescription(start, end),
        })

        await revalidate()
        router.back()
      } catch (e) {
        toast({
          title: 'Error clocking time...',
          description: getErrorMessage(e),
          variant: 'destructive',
        })
      }
    }
  }

  async function onDelete() {
    const body = JSON.stringify({
      ...time,
      deleted: true,
    })

    try {
      const res = await fetch('/api/clocked-times', {
        method: 'PUT',
        body,
      })

      if (!res.ok) {
        toast({
          title: 'Error deleting time...',
          description: `Something went wrong: ${res.statusText}`,
          variant: 'destructive',
        })

        return
      }

      toast({
        description: 'Time deleted!',
      })
    } catch (error) {
      toast({
        title: 'Error deleting time...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }

    await revalidate()
    router.back()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="start"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start day</FormLabel>
              <Popover
                open={startPopoverOpen}
                onOpenChange={setStartPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    onSelect={date => {
                      field.onChange(date)
                      setStartPopoverOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({field}) => (
            <FormItem>
              <FormLabel>Start time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="00:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>End day</FormLabel>
              <Popover open={endPopoverOpen} onOpenChange={setEndPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={date => {
                      field.onChange(date)
                      setEndPopoverOpen(false)
                    }}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({field}) => (
            <FormItem>
              <FormLabel>End time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="00:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagId"
          render={({field}) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {field.value ? (
                      <SelectValue placeholder="Select a tag" />
                    ) : (
                      'Select a tag'
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Select a tag</SelectItem>
                  {tags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-x-2">
          {time && (
            <Button
              variant="destructive"
              onClick={e => {
                e.preventDefault()
                onDelete()
              }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={e => {
              e.preventDefault()
              router.back()
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
