'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SellPage() {
  const [condition, setCondition] = useState('Good')
  const [category, setCategory] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const combined = [...images, ...files].slice(0, 5)
    setImages(combined)
    const urls = combined.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget

    try {
      const imageUrls: string[] = []
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
        const { error } = await supabase.storage
          .from('listing-images')
          .upload(fileName, image)
        if (!error) {
          const { data } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName)
          imageUrls.push(data.publicUrl)
        }
      }

      const data = {
        title: (form.querySelector('[name="title"]') as HTMLInputElement).value,
        price: (form.querySelector('[name="price"]') as HTMLInputElement).value,
        condition,
        sellerName: (form.querySelector('[name="sellerName"]') as HTMLInputElement).value,
        email: (form.querySelector('[name="email"]') as HTMLInputElement).value,
        phone: (form.querySelector('[name="phone"]') as HTMLInputElement).value,
        instagram: (form.querySelector('[name="instagram"]') as HTMLInputElement).value,
        description: (form.querySelector('[name="description"]') as HTMLTextAreaElement).value,
        faculty: (form.querySelector('[name="faculty"]') as HTMLInputElement)?.value || '',
        meetingLocation: (form.querySelector('[name="meetingLocation"]') as HTMLSelectElement).value,
        category,
        imageUrls,
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) setSubmitted(true)
      else alert('Something went wrong. Please try again.')

    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Listing submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your item is pending admin review. You'll get an email at your Carleton address once it's live — usually within a few hours.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Post another item</button>
            <a href="/listings" className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700">View listings</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-black text-red-600">Carleton<span className="text-gray-900">Marketplace</span></a>
        <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900">← Back to listings</a>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">List your item</h1>
          <p className="text-gray-500 text-sm">Fill in the details below — your listing goes live after a quick admin review.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-black text-gray-900 mb-4">Your contact info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Full name *</label>
                <input required type="text" name="sellerName" placeholder="Jane Smith" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Carleton email *</label>
                <input required type="email" name="email" placeholder="jsmith@cmail.carleton.ca" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone number</label>
                <input type="tel" name="phone" placeholder="+1 (613) 555-0100" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Instagram / Snapchat</label>
                <input type="text" name="instagram" placeholder="@username" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-black text-gray-900 mb-4">Item details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Item title *</label>
                <input required type="text" name="title" placeholder="e.g. Ravens quarter-zip hoodie (size M)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Category *</label>
                  <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white">
                    <option value="">Select a category</option>
                    <option>Textbooks</option>
                    <option>Clothing</option>
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>School Supplies</option>
                    <option>Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input required type="number" name="price" min="0" step="0.01" placeholder="0.00" className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-red-500" />
                  </div>
                </div>
              </div>

              {category === 'Textbooks' && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Textbook details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Textbook title</label>
                      <input type="text" name="textbookTitle" placeholder="e.g. Calculus: Early Transcendentals" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Author</label>
                      <input type="text" name="author" placeholder="e.g. James Stewart" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Faculty / Course</label>
                    <input type="text" name="faculty" placeholder="e.g. MATH 1007 — Engineering Math" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Condition *</label>
                <div className="flex gap-2 flex-wrap">
                  {['New', 'Like new', 'Good', 'Fair', 'For parts'].map(c => (
                    <button key={c} type="button" onClick={() => setCondition(c)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${condition === c ? 'bg-red-50 border-red-300 text-red-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description *</label>
                <textarea required name="description" minLength={20} rows={4} placeholder="Describe the item — size, colour, any wear, reason for selling..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 resize-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Preferred meeting location *</label>
                <select required name="meetingLocation" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white">
                  <option value="">Select a location</option>
                  <option>MacOdrum Library</option>
                  <option>UC Building atrium</option>
                  <option>Residence commons</option>
                  <option>Carleton LRT station</option>
                  <option>Other (specify in description)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-black text-gray-900 mb-1">Photos</h2>
            <p className="text-xs text-gray-400 mb-4">Up to 5 photos · JPG, PNG, WEBP · max 10MB each</p>
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition cursor-pointer block">
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm text-gray-500">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {previews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-black text-gray-900 mb-3">Terms & disclaimer</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed mb-4">
              <strong className="text-gray-700">Carleton Marketplace is a peer-to-peer platform.</strong> Listings are reviewed before going live. Always meet buyers in a <strong className="text-gray-700">public place on campus</strong> and inspect items before payment. Carleton Marketplace is not liable for transactions between buyers and sellers.
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-3">
              <input type="checkbox" required className="mt-0.5 accent-red-600" />
              <span className="text-sm text-gray-600">I confirm this item is mine to sell and the listing is accurate.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-red-600" />
              <span className="text-sm text-gray-600">I agree to meet buyers in a public campus location and accept Carleton Marketplace's terms.</span>
            </label>
          </div>

          <button type="submit" disabled={!agreed || loading}
            className="w-full bg-red-600 text-white font-black py-4 rounded-xl text-base hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition">
            {loading ? 'Uploading and submitting...' : 'Submit listing for review →'}
          </button>

        </form>
      </div>
    </main>
  )
}