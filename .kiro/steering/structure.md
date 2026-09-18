# Structure Steering

## Proposed Monorepo

```text
project/
├── apps/
│   ├── web/        # Next.js
│   └── api/        # NestJS
├── packages/       # optional shared code
├── docs/
├── .kiro/
└── README.md
```

## Next.js

```text
apps/web/
├── app/
│   ├── (member)/
│   ├── (admin)/
│   ├── login/
│   └── register/
├── components/
└── lib/
```

## NestJS

```text
apps/api/src/
├── auth/
├── member/
├── admin-profile/
├── space/
├── discount/
├── reservation/
├── upload/
└── report/
```

## Prisma

```text
apps/api/prisma/
├── schema.prisma
├── migrations/
└── seed.*
```

Models mengikuti final ERD.

## Upload

```text
public/uploads/
├── members/
├── spaces/
└── general/
```

## Naming

Pertahankan nama field yang dekat dengan PDF/ERD, misalnya:
`nama_space`, `harga_per_jam`, `nama_member`, `durasi_jam`.

## Dependency Direction

```text
Browser → Next.js → NestJS → Prisma → DB
```

Backend tidak boleh bergantung pada frontend.
