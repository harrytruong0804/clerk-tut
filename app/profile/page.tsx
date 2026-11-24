'use client'

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"

export default function EditProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) return
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setDisplayName(data.profile?.displayName ?? user?.fullName ?? "")
        setBio(data.profile?.bio ?? "")
      })
  }, [isSignedIn, user?.fullName])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, displayName, bio }),
    })
    const data = await res.json()
    setMessage(res.ok ? "Đã lưu!" : data.error)
  }

  if (!isLoaded) return null

  return <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center">
    <h1 className="font-bold text-xl">Hồ sơ của tôi</h1>

    {!isSignedIn &&
      <div>Bạn chưa đăng nhập, vui lòng đăng nhập!</div>}

    {isSignedIn && <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Tên hiển thị"
          className="border rounded px-3 py-1"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Giới thiệu bản thân (hỗ trợ <b>, <i>, <a>)"
          rows={4}
          className="border rounded px-3 py-1"
        />
        <button className="border bg-green-600 text-white font-semibold rounded-full px-4 py-1">
          Lưu
        </button>
      </form>
      {message && <div>{message}</div>}
      <Link href={`/u/${user.id}`} className="hover:underline">Xem trang công khai</Link>
    </>}

    <Link href={'/'}>Quay lại</Link>
  </div>
}
