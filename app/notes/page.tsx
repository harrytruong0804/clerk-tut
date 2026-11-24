'use client'

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"

type Note = {
  id: string
  text: string
  createdAt: string
}

export default function NotesPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function loadNotes() {
    const res = await fetch("/api/notes")
    if (res.ok) {
      const data = await res.json()
      setNotes(data.notes)
    }
  }

  useEffect(() => {
    if (isSignedIn) loadNotes()
  }, [isSignedIn])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      return
    }
    setText("")
    loadNotes()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/notes?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    loadNotes()
  }

  if (!isLoaded) return null

  return <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center">
    <h1 className="font-bold text-xl">Ghi chú của tôi</h1>

    {!isSignedIn &&
      <div>Bạn chưa đăng nhập, vui lòng đăng nhập!</div>}

    {isSignedIn && <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết ghi chú..."
          className="border rounded px-3 py-1"
        />
        <button className="border bg-green-600 text-white font-semibold rounded-full px-4 py-1">
          Thêm
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}

      <ul className="flex flex-col gap-2 w-full max-w-md">
        {notes.map((note) => (
          <li key={note.id} className="flex justify-between border rounded px-3 py-2">
            <span>{note.text}</span>
            <button onClick={() => handleDelete(note.id)} className="text-red-600">
              Xoá
            </button>
          </li>
        ))}
      </ul>
    </>}

    <Link href={'/'}>Quay lại</Link>
  </div>
}
