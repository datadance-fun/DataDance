import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const files = [
  {
    title: "AWS HTTP Status",
    views: "100",
    source:
      "https://static.observableusercontent.com/thumbnail/9f3d35bbbc7336d9fbb1db0e685e486e8079c2509409f558dc0a4f57c9c3e97a.jpg",
  },
  {
    title: "Ping chart",
    views: "128",
    source:
      "https://static.observableusercontent.com/thumbnail/78491fda429ec565ebfb5e6216500ef0eb838a80781f3ea91b0364450d247751.jpg",
  },
  {
    title: "How Has Men’s Tennis Changed From 1973–2021?",
    views: "512",
    source:
      "https://static.observableusercontent.com/thumbnail/9ebe2aa1a6d77235302047649837a9e852e2e1d65808fe1c6981b79b906592bc.jpg",
  },
  {
    title: "Why Visualization helps Developers",
    views: "1024",
    source:
      "https://static.observableusercontent.com/thumbnail/3e6dfa31a43ea04bde1ed3b6e746ed0adf361ce91889524b142cd8814c65b9b7.jpg",
  },
  {
    title: "Most Popular Programming Languages, 2004–2021",
    views: "310",
    source:
      "https://static.observableusercontent.com/thumbnail/b42f7df575a82d1208ece8659e1162b2d9e8047bfec1f7a99651bc33cd805cca.jpg",
  },
];

export const Collection: React.FC<{}> = () => {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 pt-6"
    >
      {files.map((file) => (
        <li
          key={file.source}
          className="relative bg-white rounded-lg p-4 shadow-[0_3px_7px_rgba(0,0,0,0.07)]"
        >
          <Link to="/create">
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden border">
              <img
                src={file.source}
                alt=""
                className="object-cover pointer-events-none group-hover:opacity-75 pt-5"
              />
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </div>
            <p className="mt-2 block font-medium text-gray-900 truncate pointer-events-none text-l pt-2">
              {file.title}
            </p>
            <p className="flex items-center justify-end text-sm font-medium text-gray-500 pointer-events-none pt-1">
              <EyeOpenIcon />
              <span className="inline-block pl-2">{file.views}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
