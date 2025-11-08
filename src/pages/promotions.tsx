import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/promotions')({
  component: PromotionsLayout,
})

function PromotionsLayout() {
  return <Outlet />
}
