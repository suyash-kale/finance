# React Elite Agent Memory

## Key File Locations

- Router: `packages/website/src/router.tsx`
- Session store (Zustand): `packages/website/src/store/session.ts`
- API service helper: `packages/website/src/services/index.ts`
- Auth service options: `packages/website/src/services/auth.ts`
- Pages: `packages/website/src/pages/`
- UI components: `packages/website/src/components/ui/`
- Shared DB types: `packages/database/src/types/user.ts` (SignInRequest, SignUpRequest, UserType)

## API & Service Layer

- Base URL: `VITE_BASE_URL=http://localhost:8000/service/` (set as `axios.defaults.baseURL`)
- Service helper signature: `service<T, D>(config: AxiosRequestConfig<D>): Promise<T>`
- Auth errors are shown via `toast.error()` inside the service helper automatically
- Mutation options pattern: `signXxxOptions(params?) => UseMutationOptions<...>`
- Sign-in endpoint: `POST auth` | Sign-up endpoint: `POST auth/signup`
- Email exists check: `POST auth/email-exists`

## Form Patterns

- Resolver: `classValidatorResolver` from `@hookform/resolvers/class-validator`
- Form mode: `{ mode: "onTouched", reValidateMode: "onChange" }`
- Form type param matches the class-validator DTO class (e.g. `useForm<SignUpRequest>()`)
- Field error display: `<FieldDescription>{form.formState.errors.field?.message}</FieldDescription>`
- Invalid state: `<Field data-invalid={!!form.formState.errors.field}>`
- Disable inputs and button with `disabled={isPending}` / `loading={isPending}`

## Component Patterns

- Card with loading state: `<Card loading={isPending}>`
- Form layout: `<form className="flex flex-col gap-3">`
- Submit row: `<div className="flex items-center justify-end"><Button type="submit" loading={isPending}>Submit</Button></div>`
- Footer links: `w-100 text-xs text-gray-600 text-center mt-4`

## Auth Flow

- On successful sign-in/sign-up: call `useSessionStore().signIn(data)`, then `navigate("/dashboard")`
- Session store exposes `signIn(user)` / `signOut()` — stores token in localStorage
- JWT token auto-attached by `services/index.ts` from `useSessionStore.getState().user`

## Routing

- Public layout: `LayoutPublic` wraps sign-in and sign-up routes
- Private layout: `LayoutPrivate` wraps dashboard and authenticated routes
- Conditional index route: unauthenticated users see sign-in at `/`, authenticated see dashboard

## Pre-existing Lint Errors (not introduced by us)

- `react-refresh/only-export-components` errors in badge.tsx, button.tsx, combobox.tsx, sidebar.tsx
