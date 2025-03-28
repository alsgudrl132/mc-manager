export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 w-full max-w-md border border-gray-300 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="username" className="font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your username"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
