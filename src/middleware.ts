import { Region } from "@medusajs/medusa"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, Region>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    var responseClone: any
    const { regions } = await fetch(
      `http://201.145.245.35.bc.googleusercontent.com:9000/store/regions`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    ).then((res) => {
      responseClone = res.clone()
      console.log("res clone===> ", responseClone.message)
      return res.json()
    })
    // const regions = [
    //   {
    //     id: "reg_01HVNWTMWZ2YFTHJKJM43ER1KH",
    //     created_at: "2024-04-17T11:24:45.572Z",
    //     updated_at: "2024-04-17T11:24:45.572Z",
    //     deleted_at: null,
    //     name: "NA",
    //     currency_code: "usd",
    //     tax_rate: 0,
    //     tax_code: null,
    //     gift_cards_taxable: true,
    //     automatic_taxes: true,
    //     tax_provider_id: null,
    //     metadata: null,
    //     countries: [
    //       {
    //         id: 39,
    //         iso_2: "ca",
    //         iso_3: "can",
    //         num_code: 124,
    //         name: "CANADA",
    //         display_name: "Canada",
    //         region_id: "reg_01HVNWTMWZ2YFTHJKJM43ER1KH",
    //       },
    //       {
    //         id: 236,
    //         iso_2: "us",
    //         iso_3: "usa",
    //         num_code: 840,
    //         name: "UNITED STATES",
    //         display_name: "United States",
    //         region_id: "reg_01HVNWTMWZ2YFTHJKJM43ER1KH",
    //       },
    //     ],
    //     currency: {
    //       code: "usd",
    //       symbol: "$",
    //       symbol_native: "$",
    //       name: "US Dollar",
    //     },
    //     fulfillment_providers: [
    //       {
    //         id: "manual",
    //         is_installed: true,
    //       },
    //     ],
    //     payment_providers: [
    //       {
    //         id: "manual",
    //         is_installed: true,
    //       },
    //     ],
    //   },
    //   {
    //     id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //     created_at: "2024-04-17T11:24:45.572Z",
    //     updated_at: "2024-04-17T11:24:45.572Z",
    //     deleted_at: null,
    //     name: "EU",
    //     currency_code: "eur",
    //     tax_rate: 0,
    //     tax_code: null,
    //     gift_cards_taxable: true,
    //     automatic_taxes: true,
    //     tax_provider_id: null,
    //     metadata: null,
    //     countries: [
    //       {
    //         id: 109,
    //         iso_2: "it",
    //         iso_3: "ita",
    //         num_code: 380,
    //         name: "ITALY",
    //         display_name: "Italy",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 209,
    //         iso_2: "es",
    //         iso_3: "esp",
    //         num_code: 724,
    //         name: "SPAIN",
    //         display_name: "Spain",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 75,
    //         iso_2: "fr",
    //         iso_3: "fra",
    //         num_code: 250,
    //         name: "FRANCE",
    //         display_name: "France",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 215,
    //         iso_2: "se",
    //         iso_3: "swe",
    //         num_code: 752,
    //         name: "SWEDEN",
    //         display_name: "Sweden",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 60,
    //         iso_2: "dk",
    //         iso_3: "dnk",
    //         num_code: 208,
    //         name: "DENMARK",
    //         display_name: "Denmark",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 82,
    //         iso_2: "de",
    //         iso_3: "deu",
    //         num_code: 276,
    //         name: "GERMANY",
    //         display_name: "Germany",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //       {
    //         id: 235,
    //         iso_2: "gb",
    //         iso_3: "gbr",
    //         num_code: 826,
    //         name: "UNITED KINGDOM",
    //         display_name: "United Kingdom",
    //         region_id: "reg_01HVNWTMSWA5H24S1A5H09VP5S",
    //       },
    //     ],
    //     currency: {
    //       code: "eur",
    //       symbol: "€",
    //       symbol_native: "€",
    //       name: "Euro",
    //     },
    //     fulfillment_providers: [
    //       {
    //         id: "manual",
    //         is_installed: true,
    //       },
    //     ],
    //     payment_providers: [
    //       {
    //         id: "manual",
    //         is_installed: true,
    //       },
    //     ],
    //   },
    // ]

    if (!regions) {
      notFound()
    }

    // Create a map of country codes to regions.
    regions.forEach((region: any) => {
      region.countries.forEach((c: any) => {
        regionMapCache.regionMap.set(c.iso_2, region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, Region | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")
  const onboardingCookie = request.cookies.get("_medusa_onboarding")
  const cartIdCookie = request.cookies.get("_medusa_cart_id")

  const regionMap = await getRegionMap()

  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (
    urlHasCountryCode &&
    (!isOnboarding || onboardingCookie) &&
    (!cartId || cartIdCookie)
  ) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  // If a cart_id is in the params, we set it as a cookie and redirect to the address step.
  if (cartId && !checkoutStep) {
    redirectUrl = `${redirectUrl}&step=address`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
    response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
