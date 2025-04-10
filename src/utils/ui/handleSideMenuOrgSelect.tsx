import { useOrg } from "@/context/OrganizationContext";
export function handleSideMenuOrgSelect(org: {
	name: string;
	logo: React.ElementType;
	plan: string;
}) {
	const { userOrgs, setUserOrgs } = useOrg();
	userOrgs.map((userOrg) => {
		if (userOrg.name === org.name) {
			setUserOrgs(userOrg);
		}
	});
	console.log(org);
}
