'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  changePassword,
  getErrorMessage,
  getProfile,
  getUserName,
  updateProfile,
  uploadAvatar,
} from './api'
import type { ChangePasswordFormValues, ProfileFormValues } from './schema'
import { changePasswordSchema, profileFormSchema } from './schema'
import ProfileDetailsForm from './_components/ProfileDetailsForm'
import SettingsSkeleton from './_components/SettingsSkeleton'
import SettingsPageHeader from './_components/SettingsPageHeader'

export default function SettingsPage() {
  const { data: session } = useSession()
  const token = session?.accessToken
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getProfile(token as string),
    enabled: !!token,
  })

  const defaultValues = useMemo(
    () => ({
      userName: getUserName(profile),
      phoneNumber: '+1 (888) 000-0000',
      gender: profile?.gender || '',
      bio: profile?.bio || '',
      country: profile?.address?.country || '',
      cityState: profile?.address?.cityState || '',
      roadArea: profile?.address?.roadArea || '',
      postalCode: profile?.address?.postalCode || '',
    }),
    [profile],
  )

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset(defaultValues)
    }
  }, [profile, defaultValues, profileForm])

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => {
      return updateProfile(token as string, {
        gender: values.gender,
        bio: values.bio,
        address: {
          country: values.country,
          cityState: values.cityState,
          roadArea: values.roadArea,
          postalCode: values.postalCode,
        },
      })
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      setIsEditing(false)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(token as string, file),
    onSuccess: () => {
      toast.success('Profile photo updated successfully')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      changePassword(token as string, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success('Password changed successfully')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      passwordForm.reset()
      setIsPasswordDialogOpen(false)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })

  const handleEditToggle = () => {
    if (isEditing) {
      profileForm.reset()
      setIsEditing(false)
      return
    }

    setIsEditing(true)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    uploadAvatarMutation.mutate(file)
    event.target.value = ''
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader />
        <div className="p-4 md:p-8">
          <SettingsSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <SettingsPageHeader />

      <div className="">
        <ProfileDetailsForm
          profile={profile}
          form={profileForm}
          isEditing={isEditing}
          isSaving={updateProfileMutation.isPending}
          isUploadingAvatar={uploadAvatarMutation.isPending}
          isPasswordDialogOpen={isPasswordDialogOpen}
          isChangingPassword={changePasswordMutation.isPending}
          fileInputRef={fileInputRef}
          onEditToggle={handleEditToggle}
          onSubmit={values => updateProfileMutation.mutate(values)}
          onAvatarClick={handleAvatarClick}
          onAvatarChange={handleAvatarChange}
          onPasswordDialogOpenChange={setIsPasswordDialogOpen}
          onPasswordSubmit={values => changePasswordMutation.mutate(values)}
          passwordForm={passwordForm}
        />
      </div>
    </div>
  )
}
