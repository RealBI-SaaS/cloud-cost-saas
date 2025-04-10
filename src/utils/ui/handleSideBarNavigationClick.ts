// sidebarUtils.ts

type NavItem = {
	name: string;
	url: string;
	icon: React.ElementType;
};

export function handleSidebarItemClick(
	e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	item: NavItem,
) {
	e.preventDefault();
	console.log("Clicked sidebar item:", item);
	// You can do more here: route, track analytics, set state, etc.
}
