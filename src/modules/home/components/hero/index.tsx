import { ShoppingBag } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="relative">
      <div
        className="h-[90vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle"
        style={{
          backgroundImage:
            "url(https://jamilamodesty.de/cdn/shop/files/IMG_6330.jpg?v=1711021736&width=3840)",
        }}
      >
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
          <span>
            <Heading
              level="h1"
              className="text-3xl leading-10 text-ui-fg-base font-normal"
            >
              Modest Wear Hub
            </Heading>
            {/* <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Medusa and Next.js
          </Heading> */}
          </span>
          <a
            href="https://github.com/medusajs/nextjs-starter-medusa"
            target="_blank"
          >
            <Button variant="secondary">
              Start Shopping
              <ShoppingBag />
            </Button>
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-white opacity-30"></div>
    </div>
  )
}

export default Hero
