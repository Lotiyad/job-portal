import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Find your next</span>{' '}
                  <span className="block text-blue-600 xl:inline">dream job today</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with top employers and discover opportunities that match your skills and aspirations. 
                  Your career journey starts here.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {user ? (
                    <div className="rounded-md shadow">
                      <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg"
                        >
                          Get Started
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg"
                        >
                          Log In
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 flex items-center justify-center">
          <div className="max-w-md w-full mx-8 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Built for jobseekers and employers
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Track applications, manage postings, and keep everything in one
              clean, professional workspace.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  1
                </span>
                <span>Discover curated roles that match your skills.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  2
                </span>
                <span>Apply with a modern, streamlined experience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  3
                </span>
                <span>Stay organized with clear dashboards for every role.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to find work
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We provide the tools you need to succeed in your job search.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white text-lg font-semibold">
                    ES
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Easy search
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Filter jobs by location, industry, and salary to find your perfect match.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white text-lg font-semibold">
                    QA
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Quick apply
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Apply to multiple jobs quickly with your saved profile.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white text-lg font-semibold">
                    TE
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Top employers
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Connect with leading companies looking for talent like you.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
