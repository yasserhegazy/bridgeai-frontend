# Project Tree

```
├── .env.local
├── .gitignore
├── .next
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache
│   │   ├── .previewinfo
│   │   ├── .rscinfo
│   │   ├── .tsbuildinfo
│   │   ├── chrome-devtools-workspace-uuid
│   │   ├── next-devtools-config.json
│   │   ├── swc
│   │   └── webpack
│   ├── package.json
│   ├── prerender-manifest.json
│   ├── react-loadable-manifest.json
│   ├── routes-manifest.json
│   ├── server
│   │   ├── app
│   │   ├── app-paths-manifest.json
│   │   ├── interception-route-rewrite-manifest.js
│   │   ├── middleware-build-manifest.js
│   │   ├── middleware-manifest.json
│   │   ├── middleware-react-loadable-manifest.js
│   │   ├── next-font-manifest.js
│   │   ├── next-font-manifest.json
│   │   ├── pages-manifest.json
│   │   ├── server-reference-manifest.js
│   │   ├── server-reference-manifest.json
│   │   ├── vendor-chunks
│   │   └── webpack-runtime.js
│   ├── static
│   │   ├── chunks
│   │   ├── css
│   │   ├── development
│   │   ├── media
│   │   └── webpack
│   ├── trace
│   └── types
│       ├── app
│       ├── cache-life.d.ts
│       ├── package.json
│       ├── routes.d.ts
│       └── validator.ts
├── README.md
├── app
│   ├── chats
│   │   └── [id]
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projects
│   │   └── [id]
│   └── teams
│       ├── [id]
│       └── page.tsx
├── components
│   ├── LayoutWrapper.tsx
│   ├── TeamSettingsGrid.tsx
│   ├── chats
│   │   └── ChatUI.tsx
│   ├── dashboard
│   │   ├── DashboardGrid.tsx
│   │   ├── Placeholder.tsx
│   │   └── Widget.tsx
│   ├── header
│   │   └── Header.tsx
│   ├── projects
│   │   └── ProjectPageGrid.tsx
│   ├── shared
│   │   ├── AvatarList.tsx
│   │   ├── CardGrid.tsx
│   │   ├── SearchBar.tsx
│   │   └── StatusBadge.tsx
│   ├── sidebar
│   │   ├── NavItem.tsx
│   │   └── Sidebar.tsx
│   ├── teams
│   │   ├── TeamsFilters.tsx
│   │   ├── TeamsHeader.tsx
│   │   ├── TeamsPagination.tsx
│   │   ├── TeamsRow.tsx
│   │   ├── TeamsSearch.tsx
│   │   └── TeamsTable.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── components.json
├── constants.ts
├── fonts.ts
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
└── tsconfig.json
```