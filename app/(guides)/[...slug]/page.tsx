import Link from "next/link"
import { notFound } from "next/navigation"
import { allGuides, allAuthors, Author } from "contentlayer/generated"
import { getTableOfContents } from "@/lib/toc"
import { Icons } from "@/components/icons"
import { Mdx } from "@/components/mdx-components"
import { DocsPageHeader } from "@/components/page-header"
import { GuideTableOfContents } from "@/components/toc"
import "@/styles/mdx.css"
import { Metadata } from "next"
import { env } from "@/env.mjs"
import { absoluteUrl, cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {BadgeCheck} from "lucide-react"
import TwitterShare from "@/components/twitter-share"
import { GuideAuthors } from "@/components/guide-authors"
import { AnimatedImage } from "@/components/animated-img"
import { ReportView } from "./view";
import { kv } from "@vercel/kv";
import { siteConfig } from "@/config/site"

import 'react-link-previewer/src/style.css'

interface GuidePageProps {
  params: {
    slug: string[]
  }
}

async function getGuideFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/")
  const guide = allGuides.find((guide) => guide.slugAsParams === slug)

  if (!guide) {
    return notFound()
  }

  return guide
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideFromParams(params)

  if (!guide) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL || "https://vvart.xyz"
  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", guide.title)
  ogUrl.searchParams.set("type", "Guide")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: guide.title,
    description: guide.description,
    authors: guide.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: absoluteUrl(guide.slug),
      images: [`${siteConfig.url}/og.jpg`],

    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [`${siteConfig.url}/og.jpg`],
    },
  }
}

export async function generateStaticParams(): Promise<
  GuidePageProps["params"][]
> {
  return allGuides.map((guide) => ({
    slug: guide.slugAsParams.split("/"),
  }))
}


export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideFromParams(params)
  const views = (await kv.get<number>(["pageviews", "guides", guide.slug].join(":"))) ?? 0;

  if (!guide) {
    notFound()
  }

  const toc = await getTableOfContents(guide.body.raw)

  const authors = guide.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  )

  return (
    <main className="relative px-3 py-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-10 xl:gap-20">
      <div>
        <TwitterShare />

        <DocsPageHeader heading={guide.title} text={guide.description} views={views ?? 0}/>
        <ReportView slug={guide.slug} />
        <AnimatedImage src={guide.image} alt={`${guide.title}`} className="select-none rounded-lg object-cover" />

        <Mdx code={guide.body.code} />
        <hr className="my-8" />
        <div className="mx-auto flex w-24 justify-between space-x-6 font-bold text-gray-300">
          THE
          <Icons.logo />
          END
          </div>
          {/* <BadgeCheck className="fill-black text-white"  size={42} /> */}

        <div className="group flex justify-start py-6 selection:bg-black  selection:text-white  selection:dark:bg-white  selection:dark:text-black  lg:py-20">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            {/* <Icons.home className="transition-all duration-300 mx-1 group-hover:mx-1.5 h-3 w-3 group-hover:scale-150 group-focus:scale-150" /> */}
            <Icons.chevronLeft className="mr-2 h-4 w-4  transition-all duration-300 group-hover:scale-150 group-focus:scale-150" />
            Go back home
          </Link>
        </div>
      </div>
      <div className="hidden w-[350px] text-sm  lg:block">

        <div className="sticky top-20">
          <GuideAuthors authors={authors as Author[]} />
        </div>

        <div className="sticky top-56 max-h-[90vh] overflow-y-hidden">
          <GuideTableOfContents toc={toc} />
        </div>
      </div>
    </main>
  )
}
