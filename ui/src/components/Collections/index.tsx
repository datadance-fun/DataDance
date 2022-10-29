import HeroBg from "../../static/hero.png";
import { Collection } from "./collection";
import { Pricing } from "./pricing";

export const CollectionsPage = () => {
  return (
    <div className="bg-white pt-12">
      {/* Hero section */}
      <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src={HeroBg}
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900 opacity-50"
        />

        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0 fit-full-height">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
            The future is here
          </h1>
          <p className="mt-4 text-xl text-white">Jumpstart your explorations</p>
          <a
            href="#collection-heading"
            className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Expore Data
          </a>
        </div>
      </div>

      <main className="bg-[#f8f1e7]">
        {/* Collection section */}
        <section
          aria-labelledby="collection-heading"
          className="max-w-xl mx-auto pt-24 px-4 sm:pt-32 sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <h2
            id="collection-heading"
            className="text-3xl font-extrabold tracking-tight text-gray-900 lg:text-6xl"
          >
            Shared Collections
          </h2>
          <p className="mt-4 text-gray-500 text-xl">
            Start by exploring any project from global community of
            visualization and analysis experts.
          </p>
          <Collection />
        </section>

        {/* Featured section */}
        <section
          aria-labelledby="comfort-heading"
          className="max-w-7xl mx-auto py-24 px-4 sm:py-24 sm:px-6"
        ></section>
      </main>
      <section>
        <Pricing />
      </section>

      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
          <div className=" border-gray-800 py-10">
            <p className="text-sm text-gray-400 text-center">
              Copyright &copy; 2022 Data Dance. Powered by TiDB Cloud.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollectionsPage;
