export default function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">

      <h1 className="text-3xl font-bold text-[#0B2F24]">
        NEWTA Admin
      </h1>

      <p className="mt-2 text-gray-500">
        Sign in to manage equipment.
      </p>

      <form className="mt-8 space-y-5">

        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border p-3"
        />

        <button
          className="w-full rounded-lg bg-[#D4AF37] py-3 font-bold text-[#0B2F24]"
        >
          Sign In
        </button>

      </form>

    </div>
  );
}