import Link from "next/link";
import MobileMenu from "@/components/mobile-menu";
import Image from "next/image";
import {
  ViewOnGitHubBanner,
  ViewOnGitHubLink,
} from "@/components/view-on-github";

export default function Home() {
  return (
    <div className="bg-white">
      <ViewOnGitHubBanner />
      <header className="absolute inset-x-0 top-10 z-50">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Hoos Helping</span>
              <div className="bg-uva-orange rounded-lg p-1.5 flex items-center justify-center w-8 h-8">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-uva-blue"
                >
                  <path
                    d="M488 0C494.627 1.28852e-06 500 5.37258 500 12V488C500 494.627 494.627 500 488 500H408C401.373 500 396 494.627 396 488V282H302V447C302 452.523 297.523 457 292 457H208C202.477 457 198 452.523 198 447V282H104V392C104 397.523 99.5228 402 94 402H10C4.47715 402 1.93283e-07 397.523 0 392V108C0 102.477 4.47715 98 10 98H94C99.5228 98 104 102.477 104 108V218H198V53C198 47.4772 202.477 43 208 43H292C297.523 43 302 47.4772 302 53V218H396V12C396 5.37258 401.373 3.22128e-08 408 0H488Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-uva-blue">
                Hoos Helping
              </span>
            </Link>
          </div>
          <MobileMenu />
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              href="/login"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Browse Tasks
            </Link>
            <Link
              href="/login"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Post a Task
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/login"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-uva-orange to-uva-blue opacity-30"
            ></div>
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
                    We&apos;re connecting the UVA community
                  </h1>
                  <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                    From moving furniture to running errands, pet sitting to
                    assembly tasks—find trusted helpers in the Charlottesville
                    community ready to lend a hand when you need it most.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Link
                      href="/login"
                      className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Get started
                    </Link>
                    <Link
                      href="/login"
                      className="text-sm/6 font-semibold text-secondary hover:text-primary"
                    >
                      Browse tasks <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"></div>
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"></div>
                    </div>
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                        alt=""
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"></div>
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                        alt=""
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"></div>
                    </div>
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base/7 font-semibold text-uva-orange">
                Simple and trusted
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
                How Hoos Helping works
              </p>
              <p className="mt-6 text-lg/8 text-gray-700">
                Whether you need help with a one-time task or you&apos;re
                looking to earn flexible income, our platform makes it easy to
                connect with trusted members of the UVA and Charlottesville
                community.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-uva-orange">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="size-6 text-white"
                      >
                        <path
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Post your task
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    Describe what you need help with—moving furniture, running
                    errands, pet sitting, or any other task. Set your budget and
                    location, and let trusted helpers come to you.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-uva-orange">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="size-6 text-white"
                      >
                        <path
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Browse and connect
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    Browse available tasks in your area with filters for
                    category, location, and payment. Find opportunities that fit
                    your skills and schedule, all within the UVA community.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-uva-orange">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="size-6 text-white"
                      >
                        <path
                          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Safe and secure
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    All transactions are processed securely through our
                    platform. No more risky cash exchanges or unverified
                    identities. We provide the safety and structure that
                    informal arrangements lack.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-uva-orange">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="size-6 text-white"
                      >
                        <path
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Rate and review
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    After completing a task, both requesters and helpers can
                    rate and review each other. Build your reputation, help
                    others make informed decisions, and maintain quality across
                    the platform.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden size-full stroke-gray-200 sm:block"
            style={{
              maskImage:
                "radial-gradient(64rem 64rem at top, white, transparent)",
            }}
          >
            <defs>
              <pattern
                id="55d3d46d-692e-45f2-becd-d8bdc9344f45"
                width="200"
                height="200"
                x="50%"
                y="0"
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="0" className="overflow-visible fill-gray-50">
              <path
                d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
                strokeWidth="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)"
              strokeWidth="0"
            />
          </svg>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-uva-orange to-uva-blue"
              ></div>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="mr-[calc(50%-12rem)] ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-uva-orange to-uva-blue xl:mr-[calc(50%-12rem)] xl:ml-0"
              ></div>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-32">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-base/7 font-semibold text-uva-orange">
                  Testimonials
                </h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                  Trusted by the UVA community
                </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm/6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
                <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
                  <blockquote className="p-6 text-lg font-semibold tracking-tight text-gray-900 sm:p-12 sm:text-xl/8">
                    <p>
                      &ldquo;I needed help moving furniture before winter break
                      and found someone within hours. The whole process was so
                      easy and everyone I worked with was reliable and
                      professional.&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
                    <Image
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 flex-none rounded-full bg-gray-50"
                    />
                    <div className="flex-auto">
                      <div className="font-semibold text-gray-900">
                        Sarah M.
                      </div>
                      <div className="text-gray-600">UVA Student</div>
                    </div>
                  </figcaption>
                </figure>
                <div className="space-y-8 xl:contents xl:space-y-0">
                  <div className="space-y-8 xl:row-span-2">
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Great platform for earning extra money between
                          classes. I&apos;ve helped several people with moving
                          and assembly tasks.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Alex K.
                          </div>
                          <div className="text-gray-600">Task Provider</div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;As a local resident, this platform helped me
                          find trustworthy students to help with yard work and
                          errands.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Michael R.
                          </div>
                          <div className="text-gray-600">
                            Charlottesville Resident
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Perfect for international students like me who
                          don&apos;t have a car. Found someone to help with
                          grocery runs easily.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Priya S.
                          </div>
                          <div className="text-gray-600">
                            International Student
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="space-y-8 xl:row-start-1">
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;The rating system gives me confidence in who
                          I&apos;m hiring. Much better than random Facebook
                          posts.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Emma T.
                          </div>
                          <div className="text-gray-600">UVA Graduate</div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;I use this regularly for pet sitting when I
                          travel. The community here is so helpful and
                          trustworthy.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Rachel L.
                          </div>
                          <div className="text-gray-600">Faculty Member</div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                </div>
                <div className="space-y-8 xl:contents xl:space-y-0">
                  <div className="space-y-8 xl:row-start-1">
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Flexible way to make money that works around my
                          class schedule. The platform makes it easy to find
                          jobs nearby.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            James C.
                          </div>
                          <div className="text-gray-600">Task Provider</div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Quick and efficient. I needed someone to
                          assemble furniture and had help the same day.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Jessica W.
                          </div>
                          <div className="text-gray-600">UVA Student</div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="space-y-8 xl:row-span-2">
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Love that I can help my neighbors while earning
                          some extra income. The secure payment system is a huge
                          plus.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            David M.
                          </div>
                          <div className="text-gray-600">Task Provider</div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;As a senior citizen, I appreciate having
                          verified students help with tasks I can&apos;t do
                          myself anymore.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Robert H.
                          </div>
                          <div className="text-gray-600">
                            Charlottesville Resident
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                    <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                      <blockquote className="text-gray-900">
                        <p>
                          &ldquo;Finally, a platform that connects the
                          university and local community. It&apos;s been
                          invaluable for both sides.&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Maria G.
                          </div>
                          <div className="text-gray-600">Community Member</div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8 xl:items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-uva-orange rounded-lg p-1.5 flex items-center justify-center w-9 h-9">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-uva-blue"
                  >
                    <path
                      d="M488 0C494.627 1.28852e-06 500 5.37258 500 12V488C500 494.627 494.627 500 488 500H408C401.373 500 396 494.627 396 488V282H302V447C302 452.523 297.523 457 292 457H208C202.477 457 198 452.523 198 447V282H104V392C104 397.523 99.5228 402 94 402H10C4.47715 402 1.93283e-07 397.523 0 392V108C0 102.477 4.47715 98 10 98H94C99.5228 98 104 102.477 104 108V218H198V53C198 47.4772 202.477 43 208 43H292C297.523 43 302 47.4772 302 53V218H396V12C396 5.37258 401.373 3.22128e-08 408 0H488Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-uva-blue">
                  Hoos Helping
                </span>
              </div>
              <p className="mt-6 max-w-xs text-sm/6 text-gray-600">
                A portfolio project for UVA CS 4971. The complete source and
                commit history are public.
              </p>
              <ViewOnGitHubLink className="mt-5 rounded-md bg-[#0d1117] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#20262e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uva-orange" />
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    Platform
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Browse Tasks
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Post a Task
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        How It Works
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    Support
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Safety Guidelines
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Community
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    Legal
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm/6 text-gray-600 hover:text-uva-orange"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
