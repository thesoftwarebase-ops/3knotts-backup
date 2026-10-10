const paths = {
  plate: <path d="M4 13c0-4 3.5-7 8-7s8 3 8 7c0 2.5-2 4.5-4.5 4.5h-7C6 17.5 4 15.5 4 13Zm8-7v4m-3-1.5h6M12 17.5c0 1.5-1.5 2.5-3.5 2.5S5 19 5 17.5" />,
  hamper: <path d="M4 9h16v3H4zM6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M12 9v11m-5.5 0h11M8.5 12.5h7" />,
  stall: <path d="M4 9 5.5 4h13L20 9M4 9h16M5 9v9m4-9v9m6-9v9m4-9v9M4 20h16" />,
  kitchen: <path d="M5 10h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-6Zm3-3h8M12 7V5.5M8.5 13.5h.01M11 13.5h.01M13.5 13.5h.01" />,
  gift: <path d="M12 8v12M5 12h14v8H5zM5 8c-1.5 0-2.5 1-2.5 2.2S3.8 12.5 5 12h7V8.5C12 7 10.8 6 9.3 6S6.5 6.5 5 8Zm14 0c1.5 0 2.5 1 2.5 2.2s-1.3 2.3-2.5 2.3h-7V8.5c0-1.5 1.2-2.5 2.7-2.5S17.5 6.5 19 8Z" />,
  garland: <path d="M6 4c0 5 2.5 9 6 9s6-4 6-9M6 4c-1 0-2 .8-2 2s1 2 2 2m12-4c1 0 2 .8 2 2s-1 2-2 2M8 9.5c-1.2-.3-2.5.5-2.5 1.8s1.3 2 2.5 1.7m8 0c1.2.3 2.5-.4 2.5-1.7S17.2 9.2 16 9.5M12 13v7m-2.5-3h5" />,
  ring: <path d="m9.5 12.5-4 4L12 20l6.5-3.5-4-4M9.5 12.5 12 5l2.5 7.5M9.5 12.5h5" />,
  stage: <path d="M4 4h16v12H4zM4 4c2.5 0 2.5 3 2.5 6s0 6 2.5 6M20 4c-2.5 0-2.5 3-2.5 6s0 6-2.5 6M9 16v4m6-4v4" />,
  home: <path d="m4 11 8-7 8 7M6.5 9.5V20h11V9.5M10 20v-5h4v5M9 13.5c1-1 5-1 6 0" />
};

export default function ServiceIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      {paths[name] || paths.gift}
    </svg>
  );
}
