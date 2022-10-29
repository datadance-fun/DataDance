import { NotebookSharePop } from "@/components/NotebookSharePop";
import { Tooltip } from "@/components/Tooltip";
import {
  GitHubLogoIcon,
  Share1Icon,
  StackIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { useLocation } from "react-router-dom";
import logo from "../favicon.svg";

function MenuBarLink_(
  {
    href,
    children,
    title,
    ...restProps
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: React.Ref<HTMLAnchorElement>
) {
  return (
    <Tooltip title={title}>
      <a
        ref={ref}
        href={href}
        className="appearance-none text-sm hover:text-rose-500 font-bold px-1 py-1 items-center inline-flex focus-ring"
        {...restProps}
      >
        {children}
      </a>
    </Tooltip>
  );
}

const MenuBarLink = React.forwardRef(MenuBarLink_);

function MenuBarLinkBlankOpen_(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: React.Ref<HTMLAnchorElement>
) {
  return <MenuBarLink ref={ref} target="_blank" rel="noreferrer" {...props} />;
}

const MenuBarLinkBlankOpen = React.forwardRef(MenuBarLinkBlankOpen_);

export function Nav() {
  const location = useLocation();

  return (
    <div className="fixed h-12 top-0 z-40 w-full backdrop-blur-sm backdrop-brightness-125 border-slate-200 border-b bg-white">
      <div className="mx-auto h-12 relative flex items-center px-[100px] space-x-4">
        <div>
          <a href="/" className="focus-ring py-2 inline-flex items-center">
            <img src={logo} alt="logo" className="w-5 h-5 mr-2" />
            <span className="font-semibold mr-2 text-slate-700">
              Data Dance
            </span>
          </a>
        </div>
        <div className="text-gray-300">|</div>
        <MenuBarLinkBlankOpen href="/" title="Explore data sets and notebooks">
          Explore
        </MenuBarLinkBlankOpen>
        <div className="flex-1"></div>
        {Boolean(
          location.pathname === "/create" ||
            location.pathname.startsWith("/gist/")
        ) && (
          <>
            <NotebookSharePop>
              <MenuBarLink title="Share this Notebook" href="javascript:;">
                <Share1Icon className="inline-block mr-2" />
                Share
              </MenuBarLink>
            </NotebookSharePop>
            <div className="text-gray-300">|</div>
          </>
        )}
        <MenuBarLinkBlankOpen
          href="/create"
          title="Create a new empty notebook"
        >
          <span
            className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600`}
          >
            <StackIcon className={`w-4 h-4 mr-1 inline-block text-red-500`} />
            Create Notebook
          </span>
        </MenuBarLinkBlankOpen>
        <MenuBarLinkBlankOpen
          href="https://twitter.com/pingcap"
          title="Follow us in Twitter"
        >
          <TwitterLogoIcon />
        </MenuBarLinkBlankOpen>
        <MenuBarLinkBlankOpen
          href="https://github.com/datadance-fun/DataDance"
          title="Open project in GitHub"
        >
          <GitHubLogoIcon />
        </MenuBarLinkBlankOpen>
      </div>
    </div>
  );
}
