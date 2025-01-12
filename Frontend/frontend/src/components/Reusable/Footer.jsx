function Footer() {
  return (
    <footer className="bg-zinc-100 text-zinc-600">
      <div className="w-full flex-col px-6 pt-20 lg:flex lg:px-10 xl:px-24">
        <div className="lg:flex lg:flex-row lg:gap-x-16">
          <div>
            <h2 className="text-2xl text-zinc-800 font-mono font-bold">
              Hotel IO
            </h2>
            <ul className="mt-4 text-sm flex flex-col items-start gap-2">
              <li className="flex items-start">
                <span aria-label="Company Icon">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 1024 1024"
                    className="w-4 h-4 mr-1 mt-1 fill-zinc-600"
                    preserveAspectRatio="none"
                  >
                    {/* <!-- SVG Path --> */}
                  </svg>
                </span>
                <p className="font-inter">Tech Solutions LLC</p>
              </li>
              <li className="flex items-start">
                <span aria-label="Address Icon">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 1024 1024"
                    className="w-4 h-4 mr-1 mt-1 fill-zinc-600"
                    preserveAspectRatio="none"
                  >
                    {/* <!-- SVG Path --> */}
                  </svg>
                </span>
                <p className="font-inter">
                  81807 E. County Road 22, Deer Trail, CO 80105, US
                </p>
              </li>
            </ul>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap lg:flex-nowrap lg:justify-center gap-4 lg:gap-x-24">
            <div>
              <h2 className="font-mono font-bold text-zinc-700 text-lg">
                Contact
              </h2>
              <ul className="mt-4 gap-2">
                <li className="flex items-start text-sm">
                  <span aria-label="Email Icon">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 1024 1024"
                      className="w-4 h-4 mr-1 mt-1 fill-zinc-600"
                      preserveAspectRatio="none"
                    >
                      {/* <!-- SVG Path --> */}
                    </svg>
                  </span>
                  <a
                    href="mailto:contact@techsolutionsco.net"
                    className="text-zinc-600 hover:underline hover:text-zinc-800"
                  >
                    contact@techsolutionsco.net
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono font-bold text-zinc-700 text-lg">
                Company
              </h2>
              <ul className="mt-4 grid gap-2 grid-cols-2">
                <li>
                  <a
                    href="/services"
                    className="text-zinc-600 hover:underline hover:text-zinc-800"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    className="text-zinc-600 hover:underline hover:text-zinc-800"
                  >
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono font-bold text-zinc-700 text-lg">
                Follow Us
              </h2>
              <ul className="mt-4 flex gap-4">
                <li>
                  <a href="https://facebook.com" aria-label="Facebook">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-zinc-600 hover:fill-zinc-800"
                    >
                      {/* <!-- Facebook SVG Path --> */}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" aria-label="Twitter">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-zinc-600 hover:fill-zinc-800"
                    >
                      {/* <!-- Twitter SVG Path --> */}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" aria-label="Instagram">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-zinc-600 hover:fill-zinc-800"
                    >
                      {/* <!-- Instagram SVG Path --> */}
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 lg:mt-16 flex flex-col lg:flex-row lg:justify-between items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="font-mono font-bold text-zinc-700 text-lg">
              Subscribe to our Newsletter
            </h2>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-zinc-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-700 text-white rounded-r-md hover:bg-zinc-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="w-full mt-10 py-10 border-t border-zinc-200 font-inter text-center text-xs text-zinc-400">
          &copy; 2024 Hotel IO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
