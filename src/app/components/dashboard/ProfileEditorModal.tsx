"use client";

import { useState } from "react";

export default function ProfileEditorModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [defaultRSN, setDefaultRSN] = useState(user?.defaultRSN ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.image ?? null
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("defaultRSN", defaultRSN);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setSuccess("Profile updated!");
      setIsOpen(false);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update profile.");
    }
  }

  function handleAvatarChange(file: File | null) {
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Responsive slide-out drawer */}
          <div
            className={`relative ml-auto h-full transform transition-transform duration-300 bg-gray-900 shadow-xl 
              w-full sm:w-96 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

              {error && <p className="text-red-500 mb-2">{error}</p>}
              {success && <p className="text-green-500 mb-2">{success}</p>}

              <form
                onSubmit={handleSubmit}
                className="flex-1 space-y-4 overflow-y-auto"
              >
                <div>
                  <label className="block text-sm mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Default RSN</label>
                  <input
                    type="text"
                    value={defaultRSN}
                    onChange={(e) => setDefaultRSN(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Avatar</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) =>
                      handleAvatarChange(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className="w-full text-gray-300"
                  />
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="mt-2 w-20 h-20 rounded-full object-cover border border-gray-600"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded bg-gray-700 text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
