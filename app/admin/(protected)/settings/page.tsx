"use client";

import { useEffect, useState, ChangeEvent } from "react";

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch("/api/account");
        const data = await response.json();

        setForm((previous) => ({
          ...previous,
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
        }));
      } catch (error) {
        console.error("Failed to load account.", error);
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
  setForm((previous) => ({
    ...previous,
    [e.target.name]: e.target.value,
  }));
}
    async function handleSave() {
  if (form.newPassword !== form.confirmPassword) {
    setMessage("New passwords do not match.");
    return;
  }

  setSaving(true);
  setMessage("");

  try {
    const response = await fetch("/api/account/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage("✅ Account updated successfully.");

    setForm((previous) => ({
      ...previous,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong.");
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-lg text-gray-600">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">

      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#0B2F24]">
          Account Settings
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your administrator account, login credentials and personal
          information.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="mb-2 block font-semibold text-[#0B2F24]">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-semibold text-[#0B2F24]">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Username */}
<div>
  <label className="mb-2 block font-semibold text-[#0B2F24]">
    Username
  </label>

  <input
    type="text"
    name="username"
    value={form.username}
    onChange={handleChange}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
  />
</div>

          <div></div>

          {/* Divider */}
          <div className="md:col-span-2 border-t pt-8">
            <h2 className="text-2xl font-bold text-[#0B2F24]">
              Change Password
            </h2>

            <p className="mt-2 text-gray-600">
              Your current password is required before a new password can be saved.
            </p>
          </div>

          {/* Current Password */}
          <div>
            <label className="mb-2 block font-semibold text-[#0B2F24]">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block font-semibold text-[#0B2F24]">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
<div className="md:col-span-2">
  <label className="mb-2 block font-semibold text-[#0B2F24]">
    Confirm New Password
  </label>

  <input
    type="password"
    name="confirmPassword"
    value={form.confirmPassword}
    onChange={handleChange}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
  />
</div>

        </div>

        {/* Save Button */}
        {message && (
  <div className="mb-6 rounded-xl border border-green-300 bg-green-100 p-4 text-green-800">
    {message}
  </div>
)}

<div className="mt-10 flex justify-end">
  <button
    onClick={handleSave}
    disabled={saving}
    className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B2F24] shadow-lg transition hover:bg-[#C89B2C] disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>
</div>

      </div>

    </div>
  );
}