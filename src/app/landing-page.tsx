
export default function LandingPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          This is the landing page. Please sign in or sign up to access your
          dashboard.
        </p>
        {/* You can add links or your custom sign in/up forms here */}
      </div>
    );
  }
  